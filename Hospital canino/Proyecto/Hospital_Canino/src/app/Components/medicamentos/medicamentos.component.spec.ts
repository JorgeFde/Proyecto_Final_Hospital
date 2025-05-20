import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentosComponent } from './medicamentos.component';

describe('MedicamentosComponent', () => {
  let component: MedicamentosComponent;
  let fixture: ComponentFixture<MedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
