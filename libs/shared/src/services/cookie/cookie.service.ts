import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST);

  setCookie(cookieName: string, cookieValue: string) {


    console.log('called setCookie ', { cookieName, cookieValue });

    if (isPlatformBrowser(this.platformId)) {
      const cookieStr = this.getCookie();
      document.cookie = cookieStr.split('; ').reduce((acc, cookie) => {
        return cookie.startsWith(`${cookieName}=`)
          ? acc + `${cookieName}=${cookieValue};`
          : acc + cookie + '; ';
      }, '');

      if (cookieStr === this.getCookie()) {
        document.cookie = `${cookieName}=${cookieValue}`;
      }
    }
  }

  getCookie() {
    return isPlatformBrowser(this.platformId)
      ? window?.document?.cookie
      : this.request?.headers.get('cookie') || '';
  }

  getCookieValue(cookieName: string): string | null {
    const cookies = this.getCookie();
    if (!cookies) return null;

    const cookieArray = cookies.split('; ');
    for (const cookie of cookieArray) {
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.split('=')[1];
      }
    }
    return null;
  }

  removeCookie(cookieName: string) {
    console.log('callwed removeCookie ', { cookieName });

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      document.cookie = this.getCookie()
        .split('; ')
        .reduce((acc, cookie) => {
          return cookie.startsWith(`${cookieName}=`)
            ? acc +
                `${cookieName}=0; Expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=strict`
            : acc + cookie + '; ';
        }, '');

      console.log({ cookie: document.cookie });
    }
  }
}
