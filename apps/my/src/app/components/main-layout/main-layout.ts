import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {

  isLogin = false;
  router = inject(Router);

  constructor() {
    this.router.events.subscribe(() => {
      this.isLogin = this.router.url === '/';
    });
  }

}