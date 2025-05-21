// todas nuestras dependencias
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgFor, NgIf } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MedicamentsModel } from '../../Interfaces/MedicamentsModel';
import { GetMedicamentsService } from '../../Services/getMedicaments.service';
@Component({
  selector: 'app-medicamentos',
  imports: [MatToolbar, NgFor, FormsModule, NgIf],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.css',
})
export class MedicamentosComponent {
  constructor(
    private firestore: Firestore,
    private medicamentosService: GetMedicamentsService
  ) {}
  private destroy$ = new Subject<void>();
  medicamentos: MedicamentsModel[] = [];
  newStocksMeds: number[] = [];
  isLoading: boolean = false;
  newMedicamento: MedicamentsModel = {
    stock: undefined,
    name: '',
    descripcion: '',
  };
  ngOnInit() {
    this.getMedicamentos();
  }
  ngOnDestroy() {
    console.log("destroyd")
    this.destroy$.next();
    this.destroy$.complete();
  }
  // se obtienen los medicamentos
  getMedicamentos() {
    this.isLoading = true;
    this.newStocksMeds = [];
    this.medicamentos = [];
    this.medicamentosService
      .getMedicaments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.medicamentos = data;
        this.medicamentos.sort((a, b) => a.name.localeCompare(b.name));
        this.isLoading = false;
      });
  }
  // creacion del medicamento
  async createMedicamentos() {
    this.isLoading = true;
    if (this.newMedicamento.name != '' && this.newMedicamento.stock != undefined && this.newMedicamento.descripcion != '') {
      try {
        await this.medicamentosService.addControlMedicamento(
          this.newMedicamento
        );
        this.createSuccessAlert('Éxito, Incidencia agregada correctamente');
        this.newMedicamento.name = '';
        this.newMedicamento.stock = 0;
        this.newMedicamento.descripcion = '';
      } catch (error) {
        this.createErrorAlert('Error, No se pudo agregar el medicamento', true);
        console.error(error);
      }
    } else {
      this.createErrorAlert(
        'Ambos campos son reuqeridos para agregar el medicamento.', false
      );
    }
    this.isLoading = false;
  }
  // Actualizacion de medicamento
  async updateMedicamentos(index: number) {
    this.isLoading = true;
    const medicamento = this.medicamentos[index];
    const id = medicamento.id;
    if (id != undefined) {
      const nuevoStock: number = this.newStocksMeds[index];
      try {
        await this.medicamentosService.updateMedicamento(id, nuevoStock);
        this.createSuccessAlert(
          'Actualizado, medicamento actualizado correctamente'
        );
        // Actualizamos visualmente la incidencia
        this.newStocksMeds = [];
        this.getMedicamentos();
      } catch (error) {
        this.createErrorAlert('Error, no se pudo actualizar el medicamento', true);
        console.error(error);
      }
    } else {
      this.createErrorAlert(
        'Error, datos invalidos para actualizar el medicamento', false
      );
    }
    this.isLoading = false;
  }
  // Eliminar medicamento
  async deleteMedicamentos(index: number) {
    const id = this.medicamentos[index].id;
    if (id != undefined) {
      this.alertDelete(id);
    } else {
      this.createErrorAlert('Error en la informacion de la incidencia.', true);
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
  createErrorAlert(message: string, isTypeError: boolean) {
    Swal.fire({
      icon: isTypeError ? 'error' : 'warning',
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
          this.createErrorAlert('Error, No se pudo eliminar la incidencia', true);
          console.error(error);
        }
      }
    });
  }
}
