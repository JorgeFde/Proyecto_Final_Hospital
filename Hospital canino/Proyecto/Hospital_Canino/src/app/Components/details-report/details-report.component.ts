import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
// Importar el servicio
import { EmailService } from '../../Services/email.service';  
// Importa FormsModule
import { FormsModule } from '@angular/forms';  

@Component({
  selector: 'app-details-report',
  imports: [MatToolbar,FormsModule],
  templateUrl: './details-report.component.html',
  styleUrl: './details-report.component.css'
})
export class DetailsReportComponent {
  nombre: string = '';
  email: string = '';
  mensaje: string = '';
  titleEmail: string = 'Falta de agregar el titulo';
  constructor(private emailService: EmailService) {}
  // Funcion para enviar al formulario
  enviarFormulario() {
    const datosFormulario = {
      nombre: this.nombre,
      titulo: this.titleEmail,
      email: this.email,
      mensaje: this.mensaje
    };
    this.emailService.enviarCorreo(datosFormulario).then(response => {
      alert('Correo enviado con éxito!');
    }).catch(error => {
      console.error('Error detallado:', error); // Esto te dirá qué está mal
      alert('Hubo un problema al enviar el correo.');
    });
  }
}
