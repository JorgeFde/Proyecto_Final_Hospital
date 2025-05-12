import { Component } from '@angular/core';
import { MatDivider} from '@angular/material/divider'
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-notifications',
  imports: [MatDivider, NgFor],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications = ["Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4","Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4","Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4","Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4","Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4","Notificacion 1", "notificacion 2", "notificacion 3", "notificacion 4"]
}
