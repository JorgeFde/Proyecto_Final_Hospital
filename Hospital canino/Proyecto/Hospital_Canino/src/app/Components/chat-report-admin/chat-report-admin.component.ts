import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../Services/chatService.service';
import { MessageModel } from '../../Interfaces/MessageModel';
import { Timestamp } from 'firebase/firestore';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat-report-admin',
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './chat-report-admin.component.html',
  styleUrl: './chat-report-admin.component.css',
})
export class ChatReportAdminComponent {
  loaded = false;
  messages: MessageModel[] = [];
  newMessage = '';
  folioChat = '';
  nameCliente = '';
  sender = 'admin';
  isLoading: boolean = false;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.loaded = true;
    }, 1);
    this.route.queryParams.subscribe((params) => {
      const folioString = params['folio'];
      const nombreString = params['nombre'];
      let folio: string | undefined;
      let name: string | undefined;
      if (folioString) {
        try {
          folio = JSON.parse(folioString) as string;
        } catch (e) {
          console.error('Error al cargar chat:', e);
        }
      }
      if (nombreString) {
        try {
          name = JSON.parse(nombreString) as string;
        } catch (error) {
          console.error('Error al cargar chat:', error);
        }
      }
      if (folio != undefined) {
        this.folioChat = folio;
        this.chatService.getMessages(this.folioChat).subscribe((msgs) => {
          this.messages = msgs;
        });
      }
      if (name != undefined) {
        this.nameCliente = name;
      }
      this.isLoading = false;
    });
  }
  async sendMessage() {
    this.isLoading = true;
    if (!this.newMessage.trim()) return;
    const msg: MessageModel = {
      text: this.newMessage,
      sender: this.sender as 'admin' | 'cliente',
      timestamp: Timestamp.now(),
    };
    await this.chatService.sendMessage(this.folioChat, msg);
    this.newMessage = '';
    this.isLoading = false;
  }
}
