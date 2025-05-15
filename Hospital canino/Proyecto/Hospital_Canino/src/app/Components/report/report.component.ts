import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgIf, NgForOf } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@angular/fire/firestore';
import { GetControlIncidenciasService } from '../../Services/getControlIncident.service';
import { ControlIncidenciaModel } from '../../Interfaces/ControlIncidenciaModel';
import { Subject, takeUntil } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GetIncidetsServices } from '../../Services/getIncidents.service';
@Component({
  selector: 'app-report',
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  constructor(
    private firestore: Firestore,
    private controlService: GetControlIncidenciasService,
    private incidentsService: GetIncidetsServices
  ) {}
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  indexMotivo: number = -1;
  name: string = '';
  lastName: string = '';
  description: string = '';
  email: string = '';
  phoneNumber: string = '';
  isLoading: boolean = false;
  incidencias: ControlIncidenciaModel[] = [];
  folio: string = '';
  isActiveFolio: boolean = true;
  ngOnInit() {
    this.getIncidencias();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getIncidencias() {
    this.controlService
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.incidencias = data;
        this.incidencias.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  // Funcion para enviar reporte
  // obtener la fecha
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // obtener el formato de tiempo
  formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }
  // Obtener el folio de 5 digitos
  generateFolio(): string {
    const timestamp = Date.now().toString().slice(-5); // últimos 5 dígitos del timestamp
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0'); // 4 dígitos aleatorios
    return `${timestamp}${random}`;
  }
  // Enviar Reporte
  async sendReport() {
    if (!this.isActiveFolio) {
      this.isLoading = true;
      if (
        this.indexMotivo != -1 &&
        this.name != '' &&
        this.lastName != '' &&
        this.email != '' &&
        this.phoneNumber != '' &&
        this.description != ''
      ) {
        // no estan vacios los campos
        const nombreCompleto = `${this.name.trim()} ${this.lastName.trim()}`;
        const status = 'Pendiente';
        const motivo = this.incidencias[this.indexMotivo].name;
        const prioridad = this.incidencias[this.indexMotivo].prioridad;
        const email = this.email.trim().toLowerCase();
        const folio = this.generateFolio();
        const phone = this.phoneNumber.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|mx)$/;
        const phoneRegex = /^\d{10}$/;
        if (!emailRegex.test(email)) {
          this.createErrorAlert('Correo no válido');
          this.isLoading = false;
          return;
        }
        if (!phoneRegex.test(phone)) {
          this.createErrorAlert('Teléfono no válido');
          this.isLoading = false;
          return;
        }
        try {
          const incidenciasRef = collection(this.firestore, 'Incidencias');
          const q = query(
            incidenciasRef,
            where('motivo', '==', motivo),
            where('name', '==', nombreCompleto),
            where('email', '==', email),
            where('phoneNumber', '==', phone)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            this.createErrorAlert('Ya existe un reporte con esos datos.');
            this.isLoading = false;
            return;
          }
          const now = new Date();
          const dateFormatted = this.formatDate(now);
          const timeFormatted = this.formatTime(now);
          await addDoc(incidenciasRef, {
            status: status,
            motivo: motivo,
            prioridad: prioridad,
            folio: folio,
            name: nombreCompleto,
            description: this.description,
            email,
            phoneNumber: phone,
            createdAt: now,
            date: dateFormatted,
            time: timeFormatted,
          });
          this.createSuccessAlert(folio);
          this.resetForm();
        } catch (error) {
          console.error('Error al enviar reporte:', error);
          this.createErrorAlert(
            'No se pudo enviar el reporte. Intenta nuevamente.'
          );
        }
        this.isLoading = false;
      } else {
        // Estan vacios algunos campos
        this.createErrorAlert(
          'No se pueden dejar vacios los campos ya que son requeridos.'
        );
        this.isLoading = false;
      }
    } else {
      this.isActiveFolio = !this.isActiveFolio;
    }
  }
  // alerta de success
  createSuccessAlert(folio: string) {
    Swal.fire({
      title: `Reporte creado correctamente, Tu folio es: <strong>${folio}</strong><br>Recuerda guardar tu folio.`,
      icon: 'success',
      draggable: true,
      confirmButtonColor: '#0e2b53',
    });
  }
  // alerta de error
  createErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrio un error...',
      text: message,
      confirmButtonColor: '#0e2b53',
    });
  }
  async folioSet() {
    if (this.isActiveFolio) {
      this.isLoading = true;
      if (this.folio != '') {
        const incidencia = await this.incidentsService.findIncidenciaByFolio(
          this.folio
        );
        if (!incidencia) {
          console.log('No existe una incidencia con ese folio.');
          return;
        }
        console.log('Folio encontrado. Status:', incidencia.status);
        if (incidencia.status === 'En revision' || incidencia. status == 'Cerrado sin contestación') {
          // se habilita el chat
          this.isLoading = false;
          this.router.navigate(['ChatReport'], {
            queryParams: {
              folio: JSON.stringify(this.folio),
            },
          });
        } else if (incidencia.status === 'Cerrado') {
          this.createErrorAlert(
            'Tu incidencia ya fue cerrada, para activar el chat debes de generar una nueva incidencia y esperar a que alguno de nuestro colaboradores se ponga en contacto.'
          );
          this.isLoading = false;
        } else {
          // la incidencia esta en pediente
          this.createErrorAlert(
            'Tu incidencia fue creada correctamente por favor espera a que uno de nuestro colaboradores se ponga en contanto contigo por correo o intenta mas tarde con tu numero de folio.'
          );
          this.isLoading = false;
        }
      } else {
        this.createErrorAlert(
          'Debes de ingresar un folio para iniciar el chat'
        );
        this.isLoading = false;
      }
    } else {
      this.isActiveFolio = !this.isActiveFolio;
    }
  }
  // resent form
  resetForm() {
    this.controlService
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.incidencias = data;
        this.incidencias.sort((a, b) => a.name.localeCompare(b.name));
      });
    this.name = '';
    this.lastName = '';
    this.description = '';
    this.email = '';
    this.phoneNumber = '';
    this.indexMotivo = -1;
  }
}
