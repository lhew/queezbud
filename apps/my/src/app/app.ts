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
export class App  {
  isLogin = false;
  isLoading = true;


  

   constructor() {
    // super(inject(Router), inject(Auth));
    // this.checkUserLoggedIn().finally(() => {
      this.isLoading = false;
    // });
  }
}

