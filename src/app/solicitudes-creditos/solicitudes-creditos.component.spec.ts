import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesCreditosComponent } from './solicitudes-creditos.component';

describe('SolicitudesCreditosComponent', () => {
  let component: SolicitudesCreditosComponent;
  let fixture: ComponentFixture<SolicitudesCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudesCreditosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudesCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
