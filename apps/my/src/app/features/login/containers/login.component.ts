import { Component, effect } from '@angular/core';
import {LoginComponent as LoginRemoteComponent} from '@queezbud/shared/components/login/login-component';
import { inject } from '@angular/core';
import { UserService } from '@queezbud/shared/services/user/User.service';
import { LoginService } from '@queezbud/shared/services/login/Login.service';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [LoginRemoteComponent],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {
  
  private userService = inject(UserService)
  private loginService = inject(LoginService)
  isLoading = false;
  errorMessage: string | null = null;

  dismissError() {
    this.errorMessage = null;
  }

  ef = effect(() => {
    const loginState = this.loginService.loginState;

    if(loginState.data){
      console.log('Login successful:', loginState.data);
      this.userService.user = loginState.data;
      // this.cookieService.setCookie('token', loginState.data.token);
      // this.router.navigate(['/dashboard'])
    }
  })

  onLoginData(data: { email: string; password: string }) {
    this.errorMessage = null;
    this.isLoading = true;


    this.loginService.onLogin(data.email, data.password);

   /* signInWithEmailAndPassword(this.auth, data.email, data.password)
      .then(userCredential => {

        const token = (userCredential.user as unknown as Record<string, string>)['accessToken'];

        this.userService.user = userCredential.user as unknown as AuthUser;
        this.cookieService.setCookie('token', token);
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
      */
  }
}
