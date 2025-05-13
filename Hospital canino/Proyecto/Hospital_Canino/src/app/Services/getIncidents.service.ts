import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IncidentsModel } from '../Interfaces/incideciasModel';
@Injectable({
  providedIn: 'root'
})
export class GetIncidetsServices {
  constructor(private firestore: Firestore) {}
  getControlIncidencias(): Observable<IncidentsModel[]> {
    const controlRef = collection(this.firestore, 'Incidencias');
    return collectionData(controlRef, { idField: 'id' }) as Observable<IncidentsModel[]>;
  }
}
