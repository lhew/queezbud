import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '@queezbud/shared/services/user/User.service';
import { CookieService } from '@queezbud/shared/services/cookie/cookie.service';
import { AuthUser } from '@queezbud/shared/types';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { SOURCE_URL_TOKEN } from '@queezbud/shared/providers/SourceURL.token';

export function init() {
  const userService = inject(UserService);
  const cookieService = inject(CookieService);
  
  try {

    const token = cookieService.getCookieValue('token');

    if(!token){
      // console.log('No token found');
      userService.user = null;
      return;
    }

    const decodedToken = jwtDecode(token as string) as AuthUser;
    if (decodedToken?.exp && new Date(decodedToken.exp * 1000) > new Date()) {
      // console.log('User is logged in');
      userService.user = decodedToken;

      // console.log('Set user from token', { user: userService.user });
    } else {
      console.log('Token expired');
      userService.user = null;
      cookieService.removeCookie('token');
    }
  } catch (error) {
    console.error('Error setting user based on token:', error);
    cookieService.removeCookie('token');
    return;
  }
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const cookieService = inject(CookieService);
  const token = cookieService.getCookieValue('token');
  const SOURCE_URL = inject(SOURCE_URL_TOKEN);


  
  if (req.url.startsWith(SOURCE_URL)) {
    
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => init()),
    {
      provide: SOURCE_URL_TOKEN,
      useValue: 'http://localhost:3333/api/',
    },
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ],
};
