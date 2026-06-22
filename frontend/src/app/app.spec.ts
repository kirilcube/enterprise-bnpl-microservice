import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { SimulatorService } from './features/simulator/simulator.service';

describe('App', () => {
  const simulatorService = {
    calculate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: SimulatorService,
          useValue: simulatorService,
        },
      ],
    }).compileComponents();
  });

  it('renders the simulator shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Simulation of BNPL calculator');
  });
});
