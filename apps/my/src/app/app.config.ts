import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from './app.firebase';


export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: firebaseConfig.API_KEY,
      authDomain: firebaseConfig.AUTH_DOMAIN,
      projectId: firebaseConfig.PROJECT_ID,
      storageBucket: firebaseConfig.STORAGE_BUCKET,
      messagingSenderId: firebaseConfig.MESSAGING_SENDER_ID,
      appId: firebaseConfig.APP_ID,
      measurementId: firebaseConfig.MEASUREMENT_ID,
     })),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
  ],
};
