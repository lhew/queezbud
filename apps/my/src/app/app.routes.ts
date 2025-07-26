import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./features/login/containers/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./features/quizz/quizz.component').then(m => m.QuizzComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/containers/dashboard-component/dashboard.component').then(m => m.DashboardComponent)
  }
];
