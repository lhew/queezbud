import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';


@Injectable({
    providedIn: 'root'
})
export class UserService {
  private _user: User | null = null;

  set user(user: User | null) {
    this._user = user;
  }

  get user(): User | null {
    return this._user;
  }

  isValidUser(): boolean {
    return this._user !== null && this._user.uid !== '';
  }
}
