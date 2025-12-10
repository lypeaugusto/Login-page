import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Primaryinput } from './primaryinput';

describe('Primaryinput', () => {
  let component: Primaryinput;
  let fixture: ComponentFixture<Primaryinput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Primaryinput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Primaryinput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
