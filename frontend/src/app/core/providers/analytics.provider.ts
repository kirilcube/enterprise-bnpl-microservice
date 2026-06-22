import { provideAppInitializer, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject as vercelAnalytics } from '@vercel/analytics';

export function provideVercelAnalytics() {
  return provideAppInitializer(() => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
      vercelAnalytics();
      console.log('📊 Vercel Analytics Initialized');
    }
  });
}
