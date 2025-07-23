import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MainLayoutComponent } from "./components/main-layout/main-layout";

@Component({
  imports: [RouterModule, MainLayoutComponent],
  
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App  {
  protected title = 'QuizzBud';
  isLogin = false;
  router = inject(Router)


  constructor() {
    this.router.events.subscribe(() => {

      this.isLogin = this.router.url === '/';
    });
  }



}
