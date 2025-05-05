import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsReportComponent } from './details-report.component';

describe('DetailsReportComponent', () => {
  let component: DetailsReportComponent;
  let fixture: ComponentFixture<DetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
