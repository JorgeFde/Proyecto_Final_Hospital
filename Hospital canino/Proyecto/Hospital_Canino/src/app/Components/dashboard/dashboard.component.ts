import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { NgClass } from '@angular/common';
import { NotificationsComponent } from "../notifications/notifications.component";
@Component({
  selector: 'app-dashboard',
  imports: [MatToolbar, NgIf, NgClass, NotificationsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isOpen: 'activos' | 'pendientes' | 'completos' | null = null;
  panelVisible: boolean = false;
  isNotification: boolean = false;
  isActiveAnimation: boolean = false
  intervalId: any;
  bellAnimating: boolean = false;
  ngOnInit() {
    this.setupNotificationAnimationLoop();
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  toggle(panel: 'activos' | 'pendientes' | 'completos') {
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

  }
}
