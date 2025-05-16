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
  statusIncident: number = 0;
  dataIncidencia: IncidentsModel | undefined;
  isLoader = false;
  constructor(
    private emailService: EmailService,
    private route: ActivatedRoute,
    private incidentsService: GetIncidetsServices
  ) {}
  ngOnInit() {
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
      this.dataIncidencia = incidencia;
      this.setUI();
    });
  }
  setUI() {
    if (this.dataIncidencia != undefined) {
      if (this.dataIncidencia.motivo == '') {
        this.createErrorAlert(
          'Error al obtener los detalles de la incidencia.'
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
                this.createSuccessAlert('Se movio a revisión');
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.');
          }
        } else if (this.dataIncidencia.status == 'En revision') {
          const id = this.dataIncidencia.id;
          if (id != undefined) {
            this.incidentsService.updateStatus(id, 'Cerrado').then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'Cerrado';
                this.setUI();
                this.createSuccessAlert(
                  'Se cerro la incidencia correctamente.'
                );
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.');
          }
        } else if (this.dataIncidencia.status == 'Cerrado sin contestación') {
          const id = this.dataIncidencia.id;
          if (id != undefined) {
            this.incidentsService.updateStatus(id, 'En revision').then(() => {
              if (this.dataIncidencia != undefined) {
                this.dataIncidencia.status = 'En revision';
                this.setUI();
                this.createSuccessAlert('Se movio a revisión');
              }
            });
          } else {
            this.createErrorAlert('Error con los datos de la incidencia.');
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
                this.createSuccessAlert('Se movio a cerrado sin contestación');
              }
            });
        } else {
          this.createErrorAlert('Error con los datos de la incidencia.');
        }
      }
    }
    this.isActiveSendEmail = false;
    this.isLoading = false;
  }
  // Funcion para enviar al formulario
  sendEmail() {
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
                'Hubo un problema al enviar el correo, contacte a soporte.'
              );
            });
        }
      } else {
        this.createErrorAlert(
          'Debes de pasar primero la incidencia a revision para poder mandar el correo.'
        );
      }
    } else {
      this.createErrorAlert('Error al obtener el detalle de la incidencia.');
    }
    this.isLoading = false;
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
              nombre: JSON.stringify(this.dataIncidencia.name)
            },
          });
        } else {
          this.createErrorAlert('Error al obtener el folio.');
        }
      } else {
        this.createErrorAlert(
          'Debes de pasar primero la incidencia a revision para poder inciar el chat.'
        );
      }
    } else {
      this.createErrorAlert('Error al obtener el detalle de la incidencia.');
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
  createErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrio un error...',
      text: message,
      confirmButtonColor: '#0e2b53',
    });
  }
}
