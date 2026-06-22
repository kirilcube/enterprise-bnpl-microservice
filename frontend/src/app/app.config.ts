import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {GrpcWebFetchTransport} from '@protobuf-ts/grpcweb-transport';

import { routes } from './app.routes';
import {GRPC_TRANSPORT} from './core/tokens/grpc-transport.token';
import {environment} from '../environments/environment';
import { provideVercelAnalytics } from "./core/providers/analytics.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideVercelAnalytics(),
    {
      provide: GRPC_TRANSPORT,
      useFactory: () => new GrpcWebFetchTransport({
        baseUrl: environment.apiUrl,
      })
    }
  ],
};
