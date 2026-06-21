import { Injectable, Inject } from '@angular/core';
import { GRPC_TRANSPORT } from '../../core/tokens/grpc-transport.token';
import { RpcTransport } from '@protobuf-ts/runtime-rpc';
import { SimulatorServiceClient } from '../../core/generated/simulator.client';
import { CalculateBNPLRequest, CalculateBNPLResponse } from '../../core/generated/simulator';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private client: SimulatorServiceClient;

  constructor(@Inject(GRPC_TRANSPORT) transport: RpcTransport) {
    this.client = new SimulatorServiceClient(transport);
  }

  async calculate(payload: CalculateBNPLRequest): Promise<CalculateBNPLResponse> {
    try {
      const { response } = await this.client.calculateBNPL(payload);
      return response;
    } catch (error) {
      console.error('Simulation failed:', error);
      throw error; // Let the component handle showing the error message
    }
  }
}
