import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReportAdminComponent } from './chat-report-admin.component';

describe('ChatReportAdminComponent', () => {
  let component: ChatReportAdminComponent;
  let fixture: ComponentFixture<ChatReportAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReportAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReportAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
