import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReportClientComponent } from './chat-report-client.component';

describe('ChatReportClientComponent', () => {
  let component: ChatReportClientComponent;
  let fixture: ComponentFixture<ChatReportClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReportClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReportClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
