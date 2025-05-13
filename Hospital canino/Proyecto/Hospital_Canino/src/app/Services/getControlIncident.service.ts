// control-incidencias.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ControlIncidencia } from '../Interfaces/ControlIncidenciaModel';
@Injectable({
  providedIn: 'root'
})
export class ControlIncidenciasService {
  constructor(private firestore: Firestore) {}
  getControlIncidencias(): Observable<ControlIncidencia[]> {
    const controlRef = collection(this.firestore, 'ControlIncidencias');
    return collectionData(controlRef, { idField: 'id' }) as Observable<ControlIncidencia[]>;
  }
}
