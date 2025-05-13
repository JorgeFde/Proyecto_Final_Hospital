import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@angular/fire/firestore';
import { ControlIncidenciasService, ControlIncidencia } from '../../Services/getControlIncident.service'
@Component({
  selector: 'app-report',
  imports: [FormsModule, NgIf],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  constructor(private firestore: Firestore, private controlService: ControlIncidenciasService) {}
  motivo: string = '';
  name: string = '';
  lastName: string = '';
  description: string = '';
  email: string = '';
  phoneNumber: string = '';
  isLoading: boolean = false;
  incidencias: ControlIncidencia[] = [];
  ngOnInit() {
    this.controlService.getControlIncidencias().subscribe(data => {
      this.incidencias = data;
      console.log('los datos son: ', this.incidencias)
    });
  }
  // Funcion para enviar reporte
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
  formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }
  async sendReport() {
    this.isLoading = true;
    if (
      this.motivo != '' &&
      this.name != '' &&
      this.lastName != '' &&
      this.email != '' &&
      this.phoneNumber != '' &&
      this.description != ''
    ) {
      // no estan vacios los campos
      const nombreCompleto = `${this.name.trim()} ${this.lastName.trim()}`;
      const motivo = this.motivo.trim().toLowerCase();
      const email = this.email.trim().toLowerCase();
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
          motivo: this.motivo,
          name: nombreCompleto,
          description: this.description,
          email,
          phoneNumber: phone,
          createdAt: now,
          date: dateFormatted,
          time: timeFormatted,
        });
        this.createSuccessAlert();
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
  }
  createSuccessAlert() {
    Swal.fire({
      title: 'Reporte creado correctamente.',
      icon: 'success',
      draggable: true,
      confirmButtonColor: "#3085d6",
    });
  }
  createErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrio un error...',
      text: message,
      confirmButtonColor: "#3085d6",
    });
  }
  resetForm() {
    this.name = '';
    this.lastName = '';
    this.description = '';
    this.email = '';
    this.phoneNumber = '';
    this.motivo = '';
  }
}
