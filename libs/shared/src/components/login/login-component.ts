import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCard,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    MatCardHeader, 
    MatFormField,
    MatCardTitle,
    MatCardContent,
    MatLabel,
    MatIconModule,
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  r = inject(Router);

  @Output() onSubmitData = new EventEmitter();
  @Input() isLoading = false;

  email = '';
  password = '';

  onSubmit($event: Event) {
    $event.preventDefault();

    if (!this.email || !this.password) return;

    this.onSubmitData.emit({ email: this.email, password: this.password });
  }
}
