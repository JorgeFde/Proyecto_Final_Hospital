// todas nuestras dependencias
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgFor } from '@angular/common';
import { PrioridadesIncidentsModel } from '../../Interfaces/PrioridadesIncidentsModel';
import { ControlIncidenciaModel } from '../../Interfaces/ControlIncidenciaModel';
import { GetControlIncidenciasService } from '../../Services/getControlIncident.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';
import { GetPrioridadIncidents } from '../../Services/GetPrioridadesIncidents.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  // todas las dependecias que se ocupan en el componenete
  selector: 'app-reasons-for-incident-list',
  imports: [MatToolbar, NgFor, FormsModule],
  templateUrl: './reasons-for-incident-list.component.html',
  styleUrl: './reasons-for-incident-list.component.css',
})
export class ReasonsForIncidentListComponent {
  constructor(
    private firestore: Firestore,
    private controlService: GetControlIncidenciasService,
    private prioridatIncidents: GetPrioridadIncidents
  ) {}
  private destroy$ = new Subject<void>();
  incidencias: ControlIncidenciaModel[] = [];
  prioridadIncidents: PrioridadesIncidentsModel[] = [];
  indexSelectPrioridadChange: number = -1;
  newIncidencia: ControlIncidenciaModel = { name: '', prioridad: '-1' };
  ngOnInit() {
    this.getIncidencias();
    this.getPrioridadIncidents();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // se obtienen las incidencias
  getIncidencias() {
    this.incidencias = [];
    this.controlService
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.incidencias = data.map(inc => ({
          ...inc,
          nuevaPrioridad: '-1' // campo temporal para el select
        }));
        this.incidencias.sort((a, b) => a.name.localeCompare(b.name));
      });
  }  
  // Obtenermos todos los tipos de prioridades
  getPrioridadIncidents() {
    this.prioridadIncidents = [];
    this.prioridatIncidents
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.prioridadIncidents = data;
        this.prioridadIncidents.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  async createIncidencia() {
    if (this.newIncidencia.name != '' && this.newIncidencia.prioridad != '-1') {
      try {
        await this.controlService.addControlIncidencia(this.newIncidencia);
        this.createSuccessAlert('Éxito, Incidencia agregada correctamente');
      } catch (error) {
        this.createErrorAlert('Error, No se pudo agregar la incidencia');
        console.error(error);
      }
    } else {
      this.createErrorAlert('Ambos campos son reuqeridos.');
    }
  }
  // Actualizacion de prioridad
  async updatePrioridad(index: number) {
    const incidencia = this.incidencias[index];
    const id = incidencia.id;
    if (id !=  undefined) {
      const nuevaPrioridad = incidencia.nuevaPrioridad;
      if (!nuevaPrioridad || nuevaPrioridad === '-1') {
        this.createErrorAlert('Selecciona una prioridad válida.');
        return;
      }
      try {
        await this.controlService.updatePrioridad(id, nuevaPrioridad);
        this.createSuccessAlert('Actualizado, Prioridad actualizada correctamente');
        // Actualizamos visualmente la incidencia
        incidencia.prioridad = nuevaPrioridad;
        incidencia.nuevaPrioridad = '-1'; // opcional: limpiar después de actualizar
      } catch (error) {
        this.createErrorAlert('Error, No se pudo actualizar la prioridad');
        console.error(error);
      }
    } else {
      this.createErrorAlert('Error, con la informacion de incidencias');
    }
  }  
  // Eliminar incidencia
  async deleteIncidencia(index: number) {
    const id = this.incidencias[index].id;
    if (id != undefined) {
      this.alertDelete(id);
    } else {
      this.createErrorAlert('Error en la informacion de la incidencia.');
    }
  }
  // alerta de success
  createSuccessAlert(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
      draggable: true,
      confirmButtonColor: '#0e2b53',
    });
  }
  // alerta de error
  createErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrio un error...',
      text: message,
      confirmButtonColor: '#0e2b53',
    });
  }
  alertDelete(id: string) {
    Swal.fire({
      icon: 'info',
      html: '¿ Estas seguro que deseas eliminar esta incidencia ?',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0e2b53',
      cancelButtonColor: '#fa0202',
      focusConfirm: false,
      confirmButtonText: 'Confirmar',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Thumbs down',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.controlService.eliminarIncidencia(id);
          this.createSuccessAlert(
            'Eliminado, Incidencia eliminada correctamente'
          );
        } catch (error) {
          this.createErrorAlert('Error, No se pudo eliminar la incidencia');
          console.error(error);
        }
      }
    });
  }
}
