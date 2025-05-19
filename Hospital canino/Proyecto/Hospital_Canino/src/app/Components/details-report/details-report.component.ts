import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
// Importar el servicio
import { EmailService } from '../../Services/email.service';
// Importa FormsModule
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { IncidentsModel } from '../../Interfaces/incideciasModel';
import { ActivatedRoute } from '@angular/router';
import { GetIncidetsServices } from '../../Services/getIncidents.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-details-report',
  imports: [MatToolbar, FormsModule, NgIf],
  templateUrl: './details-report.component.html',
  styleUrl: './details-report.component.css',
})
export class DetailsReportComponent {
  private router = inject(Router);
  isLoading: boolean = false;
  mensaje: string = '';
  isActiveSendEmail = false;
  statusIncident: number = 2;
  dataIncidencia: IncidentsModel | undefined;
  folioIncident = '';
  constructor(
    private emailService: EmailService,
    private route: ActivatedRoute,
    private incidentsService: GetIncidetsServices
  ) {}
  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      const incidenciaString = params['incidencia'];
      let incidencia: IncidentsModel | undefined;
      if (incidenciaString) {
        try {
          incidencia = JSON.parse(incidenciaString) as IncidentsModel;
        } catch (e) {
          console.error('Error al parsear incidencia:', e);
        }
      }
      if (incidencia?.folio != undefined) {
        this.folioIncident = incidencia?.folio
        this.getDataIncident();
      } else {
        this.createErrorAlert('Error al obtener el folio de la incidencia', true);
      }
    });
  }
  setUI() {
    if (this.dataIncidencia != undefined) {
      if (this.dataIncidencia.motivo == '') {
        this.createErrorAlert(
          'Error al obtener los detalles de la incidencia.', true
        );
      } else {
        if (this.dataIncidencia.status == 'Pendiente') {
          this.statusIncident = 0;
        } else if (this.dataIncidencia.status == 'En revision') {
          this.statusIncident = 1;
        } else if (this.dataIncidencia.status == 'Cerrado') {
          this.statusIncident = 2;
        } else if (this.dataIncidencia.status == 'Cerrado sin contestación') {
          this.statusIncident = 3;
        }
      }
    }
  }
  changeStatusIncident(tagButton: number) {
    this.isLoading = true;
    if (tagButton == 0) {
      // boton normal
      // aqui va la logica para cambiar el status
      if (this.dataIncidencia != undefined) {
        if (this.dataIncidencia.status == 'Pendiente') {
          const id = this.dataIncidencia.id;
          if (id != undefined) {
            this.incidentsService.updateStatus(id, 'En revision').then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'En revision';
                this.setUI();
                this.updateDataIncident();
                this.createSuccessAlert('Se movio a revisión');
                this.isActiveSendEmail = false;
                this.isLoading = false;
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.', true);
          }
        } else if (this.dataIncidencia.status == 'En revision') {
          const id = this.dataIncidencia.id;
          if (id != undefined) {
            this.incidentsService.updateStatus(id, 'Cerrado').then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'Cerrado';
                this.setUI();
                this.updateDataIncident();
                this.createSuccessAlert(
                  'Se cerro la incidencia correctamente.'
                );
                this.isActiveSendEmail = false;
                this.isLoading = false;
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.', true);
          }
        } else if (this.dataIncidencia.status == 'Cerrado sin contestación') {
          const id = this.dataIncidencia.id;
          if (id != undefined) {
            this.incidentsService.updateStatus(id, 'En revision').then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'En revision';
                this.setUI();
                this.updateDataIncident();
                this.createSuccessAlert('Se movio a revisión');
                this.isActiveSendEmail = false;
                this.isLoading = false;
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.', true);
          }
        }
      }
    } else {
      // boton pasar a cerrada sin contestacion
      if (this.dataIncidencia != undefined) {
        const id = this.dataIncidencia.id;
        if (id != undefined) {
          this.incidentsService
            .updateStatus(id, 'Cerrado sin contestación')
            .then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'Cerrado sin contestación';
                this.setUI();
                this.updateDataIncident();
                this.createSuccessAlert('Se movio a cerrado sin contestación');
                this.isActiveSendEmail = false;
                this.isLoading = false;
              }
            });
        } else {
          this.createErrorAlert('Error con los datos de la incidencia.', true);
        }
      }
    }
  }
  updateDataIncident() {
    this.getDataIncident();
  }
  getDataIncident() {
    const folio = this.folioIncident;
    if (folio != undefined) {
      this.incidentsService
        .getIncidenciaByFolio(folio)
        .then((inc) => {
          if (inc) {
            this.dataIncidencia = inc;
            this.setUI();
            this.isLoading = false;
          } else {
            this.createErrorAlert(
              'No se encontró ninguna incidencia con ese folio.', true
            );
            this.isLoading = false;
          }
        })
        .catch((err) => {
          console.error(err);
          this.createErrorAlert('Error al consultar la incidencia.', true);
         this.isLoading = false;
        });
    } else {
      // Error al obtener el folio
      this.createErrorAlert('Error al obtener el folio de la incidencia', true);
      this.isLoading = false;
    }
    console.log("loader:", this.isLoading)
  }
   // Funciones para el estado de incidencias solo aplica para las pendientes
   parseCustomDate(fechaStr: string): Date {
    // Mapa para traducir meses abreviados a números
    const MONTHS_MAP: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const [dia, mesAbrev, anio] = fechaStr.split('/');
    const mes = MONTHS_MAP[mesAbrev];
    return new Date(Number(anio), mes, Number(dia));
  }
  getDaysElapsed(incident: IncidentsModel): number {
    const fechaInc = this.parseCustomDate(incident.date);
    const hoy = new Date();
    // Limpia la hora para que la comparación sea solo por fecha
    hoy.setHours(0, 0, 0, 0);
    fechaInc.setHours(0, 0, 0, 0);
    const diffMs = hoy.getTime() - fechaInc.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
  getDotColor(incident: any): string {
    const dias = this.getDaysElapsed(incident);
    if (dias <= 5) return 'green';
    if (dias <= 9) return 'orange';
    return 'red';
  }
  getDiasLabel(incident: any): string {
    const dias = this.getDaysElapsed(incident);
    if (dias <= 5) return `${dias} día${dias !== 1 ? 's' : ''}`;
    if (dias <= 9) return `${dias} día${dias !== 1 ? 's' : ''}`;
    return `${dias} día${dias !== 1 ? 's' : ''}`;
  }
  //
  // Funcion para enviar al formulario
  sendEmail() {
    if (this.mensaje != '') {
      this.isLoading = true;
      if (this.dataIncidencia != undefined) {
        if (this.dataIncidencia.status == 'En revision') {
          if (this.dataIncidencia != undefined) {
            const datosFormulario = {
              nombre: this.dataIncidencia.name,
              titulo: this.dataIncidencia.motivo,
              email: this.dataIncidencia.email,
              mensaje: this.mensaje,
            };
            this.emailService
              .enviarCorreo(datosFormulario)
              .then((response) => {
                this.createSuccessAlertEmail('Correo enviado con éxito!');
              })
              .catch((error) => {
                console.error('Error detallado:', error); // Esto te dirá qué está mal
                this.createErrorAlert(
                  'Hubo un problema al enviar el correo, contacte a soporte.', true
                );
              });
          }
        } else {
          this.createErrorAlert(
            'Debes de pasar primero la incidencia a revision para poder mandar el correo.', false
          );
        }
      } else {
        this.createErrorAlert('Error al obtener el detalle de la incidencia.', true);
      }
      this.isLoading = false;
    } else {
      this.createErrorAlert('Debes de agregar el mensaje para enviar el correo.', false);
    }
    
  }
  tapSeendEmail() {
    this.isActiveSendEmail = !this.isActiveSendEmail;
  }
  tapInitChat() {
    if (this.dataIncidencia != undefined) {
      if (this.dataIncidencia.status == 'En revision') {
        if (this.dataIncidencia.folio != '') {
          this.router.navigate(['Chat'], {
            queryParams: {
              folio: JSON.stringify(this.dataIncidencia.folio),
              nombre: JSON.stringify(this.dataIncidencia.name),
            },
          });
        } else {
          this.createErrorAlert('Error al obtener el folio.', true);
        }
      } else {
        this.createErrorAlert(
          'Debes de pasar primero la incidencia a revision para poder inciar el chat.', false 
        );
      }
    } else {
      this.createErrorAlert('Error al obtener el detalle de la incidencia.', true);
    }
  }
  // alerta de success
  createSuccessAlertEmail(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
      draggable: true,
      confirmButtonColor: '#0e2b53',
    }).then(() => {
      this.tapSeendEmail();
    });
  }
  createSuccessAlert(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
      draggable: true,
      confirmButtonColor: '#0e2b53',
    });
  }
  // alerta de error
  createErrorAlert(message: string, isTypeError: boolean) {
    Swal.fire({
      icon: isTypeError ? 'error' : 'warning',
      title: 'Ocurrio un error...',
      text: message,
      confirmButtonColor: '#0e2b53',
    });
  }
}
