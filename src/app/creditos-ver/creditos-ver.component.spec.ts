import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditosVerComponent } from './creditos-ver.component';

describe('CreditosVerComponent', () => {
  let component: CreditosVerComponent;
  let fixture: ComponentFixture<CreditosVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditosVerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditosVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
