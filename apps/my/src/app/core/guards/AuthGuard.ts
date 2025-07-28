

import { inject, Injectable } from '@angular/core';
import { UserService } from '@queezbud/shared/services/user/User.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


    user = inject(UserService);
    router = inject(Router);


    canActivate() {
      const isAllowed = this.user.isValidUser();
      if (!isAllowed)
        this.router.navigate(['']);
      

      return isAllowed;
    }
}