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
@Component({
  selector: 'app-details-report',
  imports: [MatToolbar,FormsModule, NgIf],
  templateUrl: './details-report.component.html',
  styleUrl: './details-report.component.css'
})
export class DetailsReportComponent {
  mensaje: string = '';
  isActiveSendEmail = false;
  isInRevision = false;
  isDoneInicident = false;
  isDoneSinReply = false;
  dataIcidencia: IncidentsModel | undefined;
  constructor(private emailService: EmailService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const incidenciaString = params['incidencia'];
      let incidencia: IncidentsModel | undefined;
      if (incidenciaString) {
        try {
          incidencia = JSON.parse(incidenciaString) as IncidentsModel;
        } catch (e) {
          console.error('Error al parsear incidencia:', e);
        }
      }
      this.dataIcidencia = incidencia;
      this.setUI();
    });
  }
  setUI() {
    if (this.dataIcidencia != undefined) {
      if (this.dataIcidencia.status == 'Pendiente') {
        this.isInRevision = false;
        this.isDoneInicident = false;
        this.isDoneSinReply = false;
      } else if (this.dataIcidencia.status == 'Cerrado') {
        this.isInRevision = false;
        this.isDoneInicident = true;
        this.isDoneSinReply = false;
      } else if (this.dataIcidencia.status == 'En Revision') {
        this.isInRevision = true;
        this.isDoneInicident = false;
        this.isDoneSinReply = false;
      } else if (this.dataIcidencia.status == 'Cerrado sin contestación') {
        this.isInRevision = false;
        this.isDoneInicident = false;
        this.isDoneSinReply = true;
      }
    }
  }
  changeStatusIncident() {
    // aqui va la logica para cambiar el status
  }
  // Funcion para enviar al formulario
  sendEmail() {
    if (this.dataIcidencia != undefined) {
      const datosFormulario = {
        nombre: this.dataIcidencia.name,
        titulo: this.dataIcidencia.motivo,
        email: this.dataIcidencia.email,
        mensaje: this.mensaje
      };
      this.emailService.enviarCorreo(datosFormulario).then(response => {
        this.createSuccessAlert('Correo enviado con éxito!')
      }).catch(error => {
        console.error('Error detallado:', error); // Esto te dirá qué está mal
        this.createErrorAlert('Hubo un problema al enviar el correo, contacte a soporte.')
      });
    }
  }
  tapSeendEmail() {
    this.isActiveSendEmail = !this.isActiveSendEmail;
  }
  tapInitChat() {
    // aqui va la logica del inciar el chat -- no aplica por el momento no mover
  }
  // alerta de success
    createSuccessAlert(message: string) {
      Swal.fire({
        title: message,
        icon: 'success',
        draggable: true,
        confirmButtonColor: "#0e2b53",
      }).then (() => {
        this.tapSeendEmail();
      });
    }
    // alerta de error
    createErrorAlert(message: string) {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error...',
        text: message,
        confirmButtonColor: "#0e2b53",
      });
    }
}
