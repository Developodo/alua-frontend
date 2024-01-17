import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { StravaService } from './services/strava.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(), importProvidersFrom(StravaService), provideAnimations(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ,
    provideRouter(routes, withComponentInputBinding())]
};
