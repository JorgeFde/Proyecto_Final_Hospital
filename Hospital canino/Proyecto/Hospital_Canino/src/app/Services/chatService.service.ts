import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, onSnapshot, CollectionReference, doc, collectionData } from '@angular/fire/firestore';
import { MessageModel } from '../Interfaces/MessageModel';
import { Observable } from 'rxjs';
import { collection as fsCollection } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private firestore: Firestore) {}

  getMessages(folio: string): Observable<MessageModel[]> {
    const messagesRef = collection(this.firestore, `chats/${folio}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));
    return collectionData(q, { idField: 'id' }) as Observable<MessageModel[]>;
  }

  async sendMessage(folio: string, message: MessageModel) {
    const messagesRef = collection(this.firestore, `chats/${folio}/messages`);
    return addDoc(messagesRef, message);
  }
}
