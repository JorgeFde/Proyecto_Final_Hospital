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
  /** Devuelve la incidencia para un folio dado, o null si no existe */
  async getIncidenciaByFolio(folio: string): Promise<IncidentsModel | null> {
    const controlRef = collection(this.firestore, 'Incidencias');
    const q = query(controlRef, where('folio', '==', folio));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as IncidentsModel;
    data.id = docSnap.id;
    return data;
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
    // Obtener la fecha actual
    const now = new Date();
    // Formatear a dd/Mon/yyyy (por ejemplo: 13/May/2025)
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    // Actualizar el status y la fecha
    await updateDoc(incidenciaDocRef, {
      status: newStatus,
      dateInReview: formattedDate
    });
  }
  // Verificar incidencias con más de 3 días y actualizarlas si están "En revision"
  async checkAndUpdateStatuses(): Promise<void> {
    const controlRef = collection(this.firestore, 'Incidencias');
    const snapshot = await getDocs(controlRef);
    const now = new Date();
    // Mapa de nombres de mes a índice
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as IncidentsModel;
      const id = docSnap.id;
      if (data.status === 'En revision') {
        // 1) Parsear día/mes/año
        const [dayStr, monStr, yearStr] = data.dateInReview.split('/');
        const day   = parseInt(dayStr, 10);
        const month = monthMap[monStr];         // p.ej. "May" → 4
        const year  = parseInt(yearStr, 10);
        // 2) Parsear hora/minuto
        const [hourStr, minStr] = data.time.split(':');
        const hour   = parseInt(hourStr, 10);
        const minute = parseInt(minStr, 10);
        // 3) Crear objeto Date correcto
        const fechaIncidencia = new Date(year, month, day, hour, minute);
        // 4) Calcular diferencia en días
        const diffMs   = now.getTime() - fechaIncidencia.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        //console.log(`Incidencia ${id}: diffDays = ${diffDays}`);
        if (diffDays >= 20) {
          //console.log('Se actualizan las incidencias');
          await this.updateStatus(id, 'Cerrado sin contestación');
        } else {
          //console.log('Las fecha de la incidencia no es mayor o igual a 3 dias de que se paso a revision ')
        }
      }
    }
  }
}
