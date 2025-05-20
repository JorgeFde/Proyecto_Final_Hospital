// todas nuestras dependencias
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgFor, NgIf } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MedicamentsModel } from '../../Interfaces/MedicamentsModel';
import { GetMedicamentsService } from '../../Services/getMedicaments.service';
@Component({
  selector: 'app-medicamentos',
  imports: [MatToolbar, NgFor, FormsModule, NgIf],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.css'
})
export class MedicamentosComponent {
constructor(
    private firestore: Firestore,
    private medicamentosService: GetMedicamentsService,
  ) {}
  private destroy$ = new Subject<void>();
  medicamentos: MedicamentsModel[] = [];
  isLoading: boolean = false;
   newMedicamento: MedicamentsModel = {
     stock: 0,
     name: '',
     descripcion: ''
   };
  ngOnInit() {
    this.isLoading = true;
    this.getMedicamentos();
    this.getMedicamentos();
    this.isLoading = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // se obtienen los medicamentos
  getMedicamentos() {
    this.medicamentos = [];
    this.medicamentosService
      .getMedicaments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.medicamentos = data;
        this.medicamentos.sort((a, b) => a.name.localeCompare(b.name));
      });
  }  
  // creacion del medicamento
  async createMedicamentos() {
    this.isLoading = true;
    if (this.newMedicamento.stock != 0 ) {
      try {
        await this.medicamentosService.addControlMedicamento(this.newMedicamento);
        this.createSuccessAlert('Éxito, Incidencia agregada correctamente');
        this.newMedicamento.name = ''
        this.newMedicamento.stock = 0
      } catch (error) {
        this.createErrorAlert('Error, No se pudo agregar el medicamento');
        console.error(error);
      }
    } else {
      this.createErrorAlert('Ambos campos son reuqeridos para agregar el medicamento.');
    }
    this.isLoading = false;
  }
  // Actualizacion de medicamento
  async updateMedicamentos(index: number) {
    this.isLoading = true;
    const medicamento = this.medicamentos[index];
    const id = medicamento.id;
    if (id !=  undefined) {
      const nuevoStock: number = medicamento.stock;
      if (nuevoStock === 0) {
        this.createErrorAlert('Ingresa una cantidad valida de Stock.');
        return;
      }
      try {
        await this.medicamentosService.updateMedicamento(id, medicamento.stock);
        this.createSuccessAlert('Actualizado, medicamento actualizado correctamente');
        // Actualizamos visualmente la incidencia
        medicamento.stock = 0;
      } catch (error) {
        this.createErrorAlert('Error, no se pudo actualizar el medicamento');
        console.error(error);
      }
    } else {
      this.createErrorAlert('Error, datos invalidos para actualizar el medicamento');
    }
    this.isLoading = false;
  }  
  // Eliminar medicamento
  async deleteMedicamentos(index: number) {
    const id = this.medicamentos[index].id;
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
          this.isLoading = true;
          await this.medicamentosService.eliminarMedicamento(id);
          this.createSuccessAlert(
            'Eliminado, Incidencia eliminada correctamente'
          );
          this.isLoading = false;
        } catch (error) {
          this.createErrorAlert('Error, No se pudo eliminar la incidencia');
          console.error(error);
        }
      }
    });
  }
}
