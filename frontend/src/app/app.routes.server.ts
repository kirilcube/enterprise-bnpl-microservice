import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // We'll have a single page and since it starts with empty input, we can prerender it.
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
