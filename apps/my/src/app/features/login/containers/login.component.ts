import { Component } from '@angular/core';
import {LoginComponent as LoginRemoteComponent} from '@queezbud/shared/components/login/login-component';
import { inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { UserService } from '@queezbud/shared/services/user/User.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [LoginRemoteComponent],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {
  
  private auth = inject(Auth);
  private userService = inject(UserService)
  private router = inject(Router);
  isLoading = false;
  errorMessage: string | null = null;

  dismissError() {
    this.errorMessage = null;
  }

  onLoginData(data: { email: string; password: string }) {
    this.errorMessage = null;
    this.isLoading = true;

    signInWithEmailAndPassword(this.auth, data.email, data.password)
      .then(userCredential => {
        this.userService.user = userCredential.user;
        this.router.navigate(['/dashboard'])

      })
      .catch((error:FirebaseError) => {

        if( error.code === 'auth/user-not-found')
          this.errorMessage = 'User not found. Please check your email.';
        else if (error.code === 'auth/wrong-password') 
          this.errorMessage = 'Incorrect password. Please try again.';
        else if (error.code === 'auth/invalid-email')
          this.errorMessage = 'Invalid email address. Please enter a valid email.';
        else if (error.code === 'auth/too-many-requests') 
          this.errorMessage = 'Too many requests. Please try again later.';
        else 
          this.errorMessage = 'An unexpected error occurred. Please try again later.';

      }).finally(() => {
        this.isLoading = false;
      });
  }
}
