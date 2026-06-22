import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { track } from '@vercel/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  trackEvent(eventName: string, properties?: Record<string, string | number | boolean | null>) {
    if (this.isBrowser) {
      try {
        track(eventName, properties);
        // Optional: Leave this in for your own debugging locally
        // console.debug(`[Analytics] ${eventName}`, properties);
      } catch (error) {
        console.error('Analytics tracking failed', error);
      }
    }
  }
}
