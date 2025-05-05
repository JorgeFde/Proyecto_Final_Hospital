import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
// variables
email: string = '';
password: string = '';
// Funciones
submit() {
  if (!this.email || !this.password) {
    alert('Por favor, ingresa ambos campos.');
    return;
  }
  console.log('Correo:', this.email);
  console.log('Contraseña:', this.password);
}
}
