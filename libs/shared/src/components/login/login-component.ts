import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import { Router } from '@angular/router';


type LoginData = {
  email: string;
  password: string;
}


@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatButton, MatInputModule, MatFormFieldModule, MatCardHeader, MatFormField, MatCardTitle, MatCardContent, MatLabel],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {


  r = inject(Router)
  
  @Output() onSubmitData = new EventEmitter();

  email = '';
  password = '';




}
