import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    // Redirige al dashboard si ya está logueado
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/Dashboard']);
      }
    });
  }
  // variables
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  // Funciones
  login() {
    this.isLoading = true;
    const correoValido = /^[^\s@]+@[^\s@]+\.(com|mx)$/;
    if (!this.email || !this.password) {
      this.createErrorAlert('Por favor, ingresa tu correo y contraseña.', false);
      return;
    }
    if (!correoValido.test(this.email)) {
      this.createErrorAlert(
        'Correo no valido, Ingresa un correo válido (ejemplo@dominio.com)', true
      );
      return;
    }
    this.authService
      .login(this.email, this.password)
      .then(() => {
        //this.createSuccessAlert('Inicio de sesión exitoso');
        this.isLoading = false;
      })
      .catch((error) => {
        console.log('Error al iniciar sesion: ', error);
        this.createErrorAlert('Correo o contraseña incorrectos.', true);
        this.isLoading = false;
      });
  }
  // alerta de success
  createSuccessAlert(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      this.router.navigate(['/Dashboard']);
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
  // resent form
  resetForm() {
    this.email = '';
    this.password = '';
  }
}
