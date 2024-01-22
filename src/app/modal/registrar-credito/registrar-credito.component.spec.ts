import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCreditoComponent } from './registrar-credito.component';

describe('RegistrarCreditoComponent', () => {
  let component: RegistrarCreditoComponent;
  let fixture: ComponentFixture<RegistrarCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarCreditoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
