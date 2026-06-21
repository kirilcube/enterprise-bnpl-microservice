import { InjectionToken } from '@angular/core';
import { RpcTransport } from '@protobuf-ts/runtime-rpc';
export const GRPC_TRANSPORT = new InjectionToken<RpcTransport>('GRPC_TRANSPORT');
