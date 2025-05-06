import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [MatToolbar, MatDivider, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isOpen: 'activos' | 'pendientes' | 'completos' | null = null;

  toggle(panel: 'activos' | 'pendientes' | 'completos') {
    this.isOpen = this.isOpen === panel ? null : panel;
  }
}
