import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/AuthGuard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./features/login/containers/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/containers/dashboard-component/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'quiz',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/quizz/quizz.component').then(m => m.QuizzComponent)
  },

  {path: '**', redirectTo: ''}
];
