import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IncidentsModel } from '../Interfaces/incideciasModel';
@Injectable({
  providedIn: 'root',
})
export class GetIncidetsServices {
  constructor(private firestore: Firestore) {}
  // Obtener todas las incidencias
  getControlIncidencias(): Observable<IncidentsModel[]> {
    const controlRef = collection(this.firestore, 'Incidencias');
    return collectionData(controlRef, { idField: 'id' }) as Observable<
      IncidentsModel[]
    >;
  }
  // se checa si el folio ingresado pertenece a una incidencia
  async findIncidenciaByFolio(folio: string): Promise<IncidentsModel | null> {
    const controlRef = collection(this.firestore, 'Incidencias');
    const q = query(controlRef, where('folio', '==', folio));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null; // No se encontró ninguna incidencia con ese folio
    }

    // Suponiendo que los folios son únicos, obtenemos el primero
    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as IncidentsModel;
    data.id = docSnap.id; // Opcional, si quieres saber el ID del documento
    return data;
  }
  // Actualizar el status por ID
  async updateStatus(id: string, newStatus: string): Promise<void> {
    const incidenciaDocRef = doc(this.firestore, `Incidencias/${id}`);
    await updateDoc(incidenciaDocRef, { status: newStatus });
  }
  // Verificar incidencias con más de 3 días y actualizarlas si están "En revision"
  async checkAndUpdateStatuses(): Promise<void> {
    const controlRef = collection(this.firestore, 'Incidencias');
    const snapshot = await getDocs(controlRef);
    const now = new Date();
    snapshot.forEach(async (docSnap) => {
      const data = docSnap.data() as IncidentsModel;
      const id = docSnap.id;
      if (data.status === 'En revision') {
        const dateTimeString = `${data.date}T${data.time}`;
        const fechaIncidencia = new Date(dateTimeString);
        const diffMs = now.getTime() - fechaIncidencia.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays >= 3) {
          await this.updateStatus(id, 'Cerrado sin contestación');
        }
      }
    });
  }
}
