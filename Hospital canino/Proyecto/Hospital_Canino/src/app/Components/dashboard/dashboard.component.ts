import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { NotificationsComponent } from "../notifications/notifications.component";
import { Router } from '@angular/router';
import { inject } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  imports: [MatToolbar, NgIf, NgClass, NgFor, NotificationsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // Esto se agrega para ocupar las rutas 
  private router = inject(Router);
  isOpen: 'revision' | 'pendientes' | 'cerrados' | 'cerradosSinContestacion' | null = null;
  panelVisible: boolean = false;
  isNotification: boolean = true;
  isActiveAnimation: boolean = false
  intervalId: any;
  bellAnimating: boolean = false;
  datos = [
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
    { nombre: 'producto1', precio: 25, existencia: 10 },
  ];
  ngOnInit() {
    this.setupNotificationAnimationLoop();
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  toggle(panel: 'revision' | 'pendientes' | 'cerrados' | 'cerradosSinContestacion') {
    this.isOpen = this.isOpen === panel ? null : panel;
  }
  // panel de notificaciones
  togglePanel() {
    this.panelVisible = !this.panelVisible;
  }
  // aniacion de camapana
  setupNotificationAnimationLoop() {
    if (this.isNotification) {
      this.triggerShake();
  
      this.intervalId = setInterval(() => {
        if (this.isNotification) {
          this.triggerShake();
        }
      }, 1 * 60 * 1000); // cada 1 minutos
    }
  }
  triggerShake() {
    // activa animación
    this.bellAnimating = true;
    // detiene animación después de 2 segundos
    setTimeout(() => {
      this.bellAnimating = false;
    }, 2000);
  }
  // termina animacion de campana
  // cerrar sesion
  toggleLogOut() {
    this.router.navigate(['Home'])
  }
  // Go To Details
  goToDetails() {
    this.router.navigate(['DetailsReport'])
  }
}
