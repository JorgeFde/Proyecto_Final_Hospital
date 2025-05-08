import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-report-client',
  imports: [],
  templateUrl: './chat-report-client.component.html',
  styleUrl: './chat-report-client.component.css'
})
export class ChatReportClientComponent {
  loaded = false;
  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 1); // o usar ngAfterViewInit para mayor precisión
  }
}
