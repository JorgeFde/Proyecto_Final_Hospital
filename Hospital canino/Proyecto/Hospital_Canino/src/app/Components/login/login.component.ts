import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
// variables
private router = inject(Router);
email: string = '';
password: string = '';
// Funciones
submit() {
  //if (!this.email || !this.password) {
    //alert('Por favor, ingresa ambos campos.');
    //return;
  //}
  console.log('Correo:', this.email);
  console.log('Contraseña:', this.password);
  this.router.navigate(['Dashboard'])
}
}
