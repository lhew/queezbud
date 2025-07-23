import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, MaterialModule],
  template: `
    <mat-toolbar color="primary">
      <span>QuizzBud</span>
      <span class="spacer"></span>
      <nav>
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/quiz" routerLinkActive="active-link">Quizz</a>
        <a mat-button routerLink="/quizz-new" routerLinkActive="active-link">New Quizz</a>
      </nav>
    </mat-toolbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class MainLayoutComponent {}