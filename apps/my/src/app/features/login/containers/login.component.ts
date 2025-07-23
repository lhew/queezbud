import { Component } from '@angular/core';
import {LoginComponent as LoginRemoteComponent} from '@queezbud/shared/components/login/login-component';


@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [LoginRemoteComponent],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {}
