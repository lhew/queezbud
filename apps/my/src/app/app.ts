import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MainLayoutComponent } from "./components/main-layout/main-layout";
import { Auth, authState } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [RouterModule, MainLayoutComponent, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router)
  private auth = inject(Auth);
  isLogin = false;
  isLoading = true;

  checkUserLoggedIn(): void {
    authState(this.auth)
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          if (user?.uid) {
            this.router.navigate(['/dashboard']);
          }
        },

      error: (error) => {
        console.error('Error checking user login status:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  constructor() {
    this.checkUserLoggedIn();
  }
}
