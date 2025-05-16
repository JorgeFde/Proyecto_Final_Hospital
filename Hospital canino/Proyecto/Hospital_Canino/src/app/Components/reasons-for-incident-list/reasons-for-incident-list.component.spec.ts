import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonsForIncidentListComponent } from './reasons-for-incident-list.component';

describe('ReasonsForIncidentListComponent', () => {
  let component: ReasonsForIncidentListComponent;
  let fixture: ComponentFixture<ReasonsForIncidentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasonsForIncidentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasonsForIncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
