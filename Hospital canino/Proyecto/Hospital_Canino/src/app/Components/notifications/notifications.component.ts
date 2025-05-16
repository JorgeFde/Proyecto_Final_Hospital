import { Component, Input } from '@angular/core';
import { MatDivider} from '@angular/material/divider'
import { NgFor } from '@angular/common';
import { MedicamentsModel } from '../../Interfaces/MedicamentsModel';
@Component({
  selector: 'app-notifications',
  imports: [MatDivider, NgFor],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Input() notifications: MedicamentsModel[] = [];
}
