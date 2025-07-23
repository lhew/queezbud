import { Route } from '@angular/router';
import { DashboardComponent } from './features/dashboard/containers/dashboard-component/dashboard.component';
import { QuizzComponent } from './features/quizz/quizz.component';
import { LoginComponent } from './features/login/containers/login.component';


export const appRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'quiz',
    component: QuizzComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }

];
