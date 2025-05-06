import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { NgIf, NgStyle } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [MatToolbar, MatDivider, MatIcon, NgIf, NgStyle],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isOpen: 'activos' | 'pendientes' | 'completos' | null = null;

  toggle(panel: 'activos' | 'pendientes' | 'completos') {
    this.isOpen = this.isOpen === panel ? null : panel;
  }
}
