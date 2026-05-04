import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejosCarrusel } from './consejos-carrusel';

describe('ConsejosCarrusel', () => {
  let component: ConsejosCarrusel;
  let fixture: ComponentFixture<ConsejosCarrusel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsejosCarrusel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsejosCarrusel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
