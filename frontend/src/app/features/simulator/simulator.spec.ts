import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Simulator } from './simulator';
import { SimulatorService } from './simulator.service';
import type { CalculateBNPLResponse } from '../../core/generated/simulator';

describe('Simulator', () => {
  let component: Simulator;
  let fixture: ComponentFixture<Simulator>;
  let calcData: ReturnType<typeof signal<{ amount: bigint; months: number }>>;
  let simulatorService: {
    calculate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    simulatorService = {
      calculate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Simulator],
      providers: [
        {
          provide: SimulatorService,
          useValue: simulatorService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Simulator);
    component = fixture.componentInstance;
    fixture.detectChanges();

    calcData = signal({
      amount: 0n,
      months: 3,
    });
    (component as any).calcData = calcData;
    TestBed.runInInjectionContext(() => {
      (component as any).setupSimulationPipeline();
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function setCalcData(amountInCents: bigint, months: number) {
    component.centsAmount.set(amountInCents);
    component.months.set(months);
    calcData.set({
      amount: amountInCents,
      months,
    });
    TestBed.tick();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not request a simulation before the form is valid', async () => {
    vi.useFakeTimers();
    await vi.advanceTimersByTimeAsync(200);

    expect(simulatorService.calculate).not.toHaveBeenCalled();
  });

  it('updates the quote and enables confirmation after a successful calculation', async () => {
    vi.useFakeTimers();
    const response: CalculateBNPLResponse = {
      cashbackCents: 500n,
      cashbackPercents: 5,
      installments: [33334n, 33333n, 33333n],
    };
    simulatorService.calculate.mockResolvedValue(response);

    setCalcData(100000n, 3);
    await vi.advanceTimersByTimeAsync(150);
    TestBed.tick();

    expect(simulatorService.calculate).toHaveBeenCalledWith({
      amountCents: 100000n,
      months: 3,
    });
    expect(component.monthlyPaymentsInCents()).toEqual(response.installments);
    expect(component.cashbackCents()).toBe(500n);
    expect(component.cashbackPercents()).toBe(5);
    expect(component.allowConfirming()).toBe(true);
    expect(component.isErrorWhenCalculation()).toBe(false);
  });

  it('clears previous values while a recalculation is pending', async () => {
    vi.useFakeTimers();
    let resolveResponse!: (value: CalculateBNPLResponse) => void;
    simulatorService.calculate.mockImplementation(
      () =>
        new Promise<CalculateBNPLResponse>((resolve) => {
          resolveResponse = resolve;
        }),
    );

    component.monthlyPaymentsInCents.set([90000n]);
    component.cashbackCents.set(1500n);
    component.cashbackPercents.set(3);

    setCalcData(250000n, 6);

    await vi.advanceTimersByTimeAsync(100);
    TestBed.tick();
    expect(simulatorService.calculate).toHaveBeenCalledWith({
      amountCents: 250000n,
      months: 6,
    });
    expect(component.monthlyPaymentsInCents()).toEqual([90000n]);

    await vi.advanceTimersByTimeAsync(50);
    TestBed.tick();
    expect(component.monthlyPaymentsInCents()).toEqual([]);
    expect(component.cashbackCents()).toBe(0n);
    expect(component.cashbackPercents()).toBe(0);

    resolveResponse({
      cashbackCents: 7500n,
      cashbackPercents: 3,
      installments: [41667n, 41667n, 41666n, 41667n, 41667n, 41666n],
    });
    await Promise.resolve();
    TestBed.tick();

    expect(component.monthlyPaymentsInCents()).toEqual([
      41667n,
      41667n,
      41666n,
      41667n,
      41667n,
      41666n,
    ]);
    expect(component.cashbackCents()).toBe(7500n);
    expect(component.cashbackPercents()).toBe(3);
  });

  it('shows an error state when the simulation request fails', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    simulatorService.calculate.mockRejectedValue(new Error('offline'));

    setCalcData(100000n, 4);

    await vi.advanceTimersByTimeAsync(150);
    TestBed.tick();
    fixture.detectChanges();

    expect(component.isErrorWhenCalculation()).toBe(true);
    expect(component.allowConfirming()).toBe(false);
    expect(component.monthlyPaymentsInCents()).toEqual([]);
    expect(component.cashbackCents()).toBe(0n);
    expect(component.cashbackPercents()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Error when trying to connect to server');
  });
});
