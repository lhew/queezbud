import { inject, Injectable, signal } from '@angular/core';
import { AuthUser } from '@queezbud/shared/types';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../user/User.service';
import { CookieService } from '../cookie/cookie.service';
import { Router } from '@angular/router';
import { SOURCE_URL_TOKEN } from '@queezbud/shared/providers/SourceURL.token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private login = signal<{
    data: AuthUser | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  private http = inject(HttpClient);
  private userService = inject(UserService);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private BASE_URL = inject(SOURCE_URL_TOKEN)

  onLogin(email: string, password: string) {
    this.login.set({ data: null, loading: true, error: null });

    this.http
      .post<{ token: string; refreshToken: string; userId: string }>(
        this.BASE_URL.replace(/\/api\/$/, '') + '/access',
        { email, password }
      )
      .subscribe({
        next: (data) => {
          const decoded = jwtDecode<{
            email: string;
            exp: number;
            iat: number;
            sub: string;
          }>(data['token']);

          this.userService.user = decoded as AuthUser;
          
          this.cookieService.setCookie('token', `${data.token}; expires=${new Date(decoded.exp * 1000).toUTCString()};`);
          this.cookieService.setCookie('refreshToken', `${data.refreshToken}; expires=${new Date(decoded.exp * 1000).toUTCString()};`);

          this.login.set({
            data: decoded as AuthUser,
            loading: false,
            error: null,
          });

          this.router.navigate(['/dashboard']);
        },
        error: (error) =>
          this.login.set({ data: null, loading: false, error: error.message }),
      });
  }

  get loginState() {
    return this.login.asReadonly()();
  }
}
