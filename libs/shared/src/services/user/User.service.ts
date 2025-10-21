import { Injectable, signal } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthUser } from '@queezbud/shared/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user = signal<AuthUser | null>(null);

  set user(user: AuthUser | null) {
    this._user.set(user);
  }

  get user(): AuthUser | null {
    return this._user.asReadonly()() as AuthUser | null;
  }

  isValidUser(): boolean {
    return this.user !== null && this.user?.user_id !== '';
  }
}
