import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import {GrpcTransport} from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import {GRPC_TRANSPORT} from './core/tokens/grpc-transport.token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: GRPC_TRANSPORT,
      useFactory: () => new GrpcTransport({
        host: process.env['GRPC_SERVER_HOST'] || 'api-backend:8080',
        channelCredentials: ChannelCredentials.createInsecure()
      })
    }
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
