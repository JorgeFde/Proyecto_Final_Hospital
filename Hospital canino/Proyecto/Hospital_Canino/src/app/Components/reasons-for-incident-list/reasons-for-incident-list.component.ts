// todas nuestras dependencias
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgFor } from '@angular/common';
@Component({
  // todas las dependecias que se ocupan en el componenete 
  selector: 'app-reasons-for-incident-list',
  imports: [MatToolbar, NgFor],
  templateUrl: './reasons-for-incident-list.component.html',
  styleUrl: './reasons-for-incident-list.component.css'
})
export class ReasonsForIncidentListComponent {
 incidencias = ["","",""]
}


