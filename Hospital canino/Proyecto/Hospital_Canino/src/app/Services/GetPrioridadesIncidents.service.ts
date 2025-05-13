import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PrioridadesIncidentsModel } from '../Interfaces/PrioridadesIncidentsModel';
@Injectable({
  providedIn: 'root'
})
export class GetPrioridadIncidents {
  constructor(private firestore: Firestore) {}
  getControlIncidencias(): Observable<PrioridadesIncidentsModel[]> {
    const controlRef = collection(this.firestore, 'PrioridadesIncidents');
    return collectionData(controlRef, { idField: 'id' }) as Observable<PrioridadesIncidentsModel[]>;
  }
}