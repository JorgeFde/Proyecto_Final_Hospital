import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  // variables 
  email: string = '';
  password: string = '';
  // Funciones
  login() {
    const correoValido = /^[^\s@]+@[^\s@]+\.(com|mx)$/;
    if (!this.email || !this.password) {
      this.createErrorAlert('Por favor, ingresa tu correo y contraseña.')
      return;
    }
    if (!correoValido.test(this.email)) {
      this.createErrorAlert('Correo no valido, Ingresa un correo válido (ejemplo@dominio.com)')
      return;
    }
    this.authService.login(this.email, this.password)
    .then(() => {
      this.createSuccessAlert("Inicio de sesión exitoso")
    })
    .catch((error) => {
      console.log("Error al iniciar sesion: ", error) 
      this.createErrorAlert('Correo o contraseña incorrectos.');
    });
  }
  // alerta de success
    createSuccessAlert(message: string) {
      Swal.fire({
        title: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      }).then (() => {
        this.router.navigate(['/Dashboard']);
      });
    }
    // alerta de error
    createErrorAlert(message: string) {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error...',
        text: message,
        confirmButtonColor: "#3085d6",
      });
    }
    // resent form 
    resetForm() {
     this.email = '';
     this.password = '';
    }
}
