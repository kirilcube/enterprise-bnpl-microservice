import { Injectable, Inject, inject } from '@angular/core';
import { RpcTransport } from '@protobuf-ts/runtime-rpc';
import { AnalyticsService } from '../../core/services/analytics.service';
import { GRPC_TRANSPORT } from '../../core/tokens/grpc-transport.token';
import { SimulatorServiceClient } from '../../core/generated/simulator.client';
import { CalculateBNPLRequest, CalculateBNPLResponse } from '../../core/generated/simulator';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private client: SimulatorServiceClient;
  private analytics = inject(AnalyticsService);

  constructor(@Inject(GRPC_TRANSPORT) transport: RpcTransport) {
    this.client = new SimulatorServiceClient(transport);
  }

  async calculate(payload: CalculateBNPLRequest): Promise<CalculateBNPLResponse> {
    try {
      const { response } = await this.client.calculateBNPL(payload);
      this.analytics.trackEvent('calculated', {
        amount_cents: Number(payload.amountCents),
        months_selected: payload.months,
        cashback_cents: Number(response.cashbackCents),
        cashback_percents: Number(response.cashbackPercents),
      });
      return response;
    } catch (error: any) {
      console.error('Calculation failed:', error);
      this.analytics.trackEvent('grpc_api_failure', {
        error_code: error?.code || 'unknown',
        error_message: error?.message || "no message"
      });
      throw error;
    }
  }
}
