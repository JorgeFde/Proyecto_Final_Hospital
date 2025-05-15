import { Component } from '@angular/core';
import { ChatService } from '../../Services/chatService.service';
import { MessageModel } from '../../Interfaces/MessageModel';
import { Timestamp } from 'firebase/firestore';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat-report-client',
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './chat-report-client.component.html',
  styleUrl: './chat-report-client.component.css',
})
export class ChatReportClientComponent {
  private router = inject(Router);
  loaded = false;
  messages: MessageModel[] = [];
  newMessage = '';
  folioChat = '';
  sender = 'cliente';
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
      let folio: string | undefined;
      if (folioString) {
        try {
          folio = JSON.parse(folioString) as string;
        } catch (e) {
          console.error('Error al cargar chat:', e);
        }
      }
      if (folio != undefined && folio != "") {
        this.folioChat = folio;
        this.chatService.getMessages(this.folioChat).subscribe((msgs) => {
          this.messages = msgs;
        });
      } else {
        this.router.navigate(['Report']);
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
