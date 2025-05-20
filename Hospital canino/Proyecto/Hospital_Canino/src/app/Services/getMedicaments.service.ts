import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MedicamentsModel } from '../Interfaces/MedicamentsModel';
@Injectable({
  providedIn: 'root',
})
export class GetMedicamentsService {
  constructor(private firestore: Firestore) {}
  // Se obtienen todos los medicamentos
  getMedicaments(): Observable<MedicamentsModel[]> {
    const controlRef = collection(this.firestore, 'Medicamentos');
    return collectionData(controlRef, { idField: 'id' }) as Observable<
      MedicamentsModel[]
    >;
  }
  // Agregar una nueva medicamento
  async addControlMedicamento(data: MedicamentsModel): Promise<void> {
    const controlRef = collection(this.firestore, 'Medicamentos');
    await addDoc(controlRef, data);
  }
  // Actualizar medicamento
  async updateMedicamento(id: string, newStock: number): Promise<void> {
    const docRef = doc(this.firestore, 'Medicamentos', id);
    await updateDoc(docRef, { stock: newStock });
  }
  // Eliminar un medicamento
  async eliminarMedicamento(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'Medicamentos', id);
    await deleteDoc(docRef);
  }
}
