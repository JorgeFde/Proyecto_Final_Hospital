import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-report-admin',
  imports: [],
  templateUrl: './chat-report-admin.component.html',
  styleUrl: './chat-report-admin.component.css'
})
export class ChatReportAdminComponent {
  loaded = false;
  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 1); // o usar ngAfterViewInit para mayor precisión
  }
}
