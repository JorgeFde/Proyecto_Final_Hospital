import { Injectable } from '@angular/core';
 // Importar EmailJS
import emailjs from 'emailjs-com'; 
 // Importar la configuración
import { emailJSConfig } from '../../emailjs.config'; 
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor() { }
  enviarCorreo(datosFormulario: any) {
    const templateParams = {
      name: datosFormulario.nombre,
      title: datosFormulario.titulo,
      email: datosFormulario.email,
      message: datosFormulario.mensaje
    };
    return emailjs.send(
      emailJSConfig.serviceID,  // Tu Service ID
      emailJSConfig.templateID,  // Tu Template ID
      templateParams,  // Datos a enviar en el correo
      emailJSConfig.userID  // Tu User ID
    ).then((response) => {
      console.log('Correo enviado con éxito:', response);
      return response;
    }).catch((error) => {
      console.error('Error al enviar correo:', error);
      throw error;
    });
  }
}
