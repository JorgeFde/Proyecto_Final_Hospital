import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MedicamentsModel } from '../Interfaces/MedicamentsModel';
@Injectable({
  providedIn: 'root'
})
export class GetMedicamentsService {
  constructor(private firestore: Firestore) {}
  getMedicaments(): Observable<MedicamentsModel[]> {
    const controlRef = collection(this.firestore, 'Medicamentos');
    return collectionData(controlRef, { idField: 'id' }) as Observable<MedicamentsModel[]>;
  }
}
