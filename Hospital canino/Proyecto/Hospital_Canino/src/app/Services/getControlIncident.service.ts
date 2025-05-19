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
import { ControlIncidenciaModel } from '../Interfaces/ControlIncidenciaModel';

@Injectable({
  providedIn: 'root',
})
export class GetControlIncidenciasService {
  constructor(private firestore: Firestore) {}

  // Obtener todas las incidencias
  getControlIncidencias(): Observable<ControlIncidenciaModel[]> {
    const controlRef = collection(this.firestore, 'ControlIncidencias');
    return collectionData(controlRef, { idField: 'id' }) as Observable<ControlIncidenciaModel[]>;
  }
  // Agregar una nueva incidencia
  async addControlIncidencia(data: ControlIncidenciaModel): Promise<void> {
    const controlRef = collection(this.firestore, 'ControlIncidencias');
    await addDoc(controlRef, data);
  }
  // Actualizar la prioridad de una incidencia
  async updatePrioridad(id: string, nuevaPrioridad: string): Promise<void> {
    const docRef = doc(this.firestore, 'ControlIncidencias', id);
    await updateDoc(docRef, { prioridad: nuevaPrioridad });
  }
  // Eliminar una incidencia
  async eliminarIncidencia(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'ControlIncidencias', id);
    await deleteDoc(docRef);
  }
}
