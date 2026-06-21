import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscreteSlider } from './discrete-slider';

describe('DiscreteSlider', () => {
  let component: DiscreteSlider;
  let fixture: ComponentFixture<DiscreteSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscreteSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscreteSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
