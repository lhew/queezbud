import { Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@queezbud/shared/services/user/User.service';
import { HomeComponent } from '../features/home/containers/home.component';
import { LoginComponent } from '../features/login/containers/login.component';
import { DashboardMainWrapperComponent } from '../components/dashboard-main-wrapper/dashboard-main-wrapper.component';
import { QuizMainComponent } from '../features/quiz/containers/main/quiz-main.component';
import { QuizCreateComponent } from '../features/quiz/containers/create/quiz-create.component';
import { QuizListComponent } from '../features/quiz/containers/list/quiz-list.component';
import { ProfileComponent } from '../features/profile/containers/profile-component';

const checkAuthForLogin = async () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isValidUser()) {
    router.navigate(['dashboard/quiz/create']);
    return false;
  }

  return true;
};

const checkAuthForProtectedRoutes = () => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isValidUser()) {
    router.navigate(['/login']);
    return false;
  }


  return true;
};

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [checkAuthForLogin],
  },
  {
    path: 'dashboard',
    component: DashboardMainWrapperComponent,
    canActivate: [checkAuthForProtectedRoutes],
    children: [
      {
        path: 'quiz',
        canActivate: [checkAuthForProtectedRoutes],
        component: QuizMainComponent,
        children: [
          {
            path: 'create',
            component: QuizCreateComponent,
            canActivate: [checkAuthForProtectedRoutes],
          },

          {
            path: 'edit/:quizId',
            component: QuizCreateComponent,
            canActivate: [checkAuthForProtectedRoutes],
          },
          {
            path: 'list',
            component: QuizListComponent,
            canActivate: [checkAuthForProtectedRoutes],
          },
        ],
      },

      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [checkAuthForProtectedRoutes],
      },
    ],
  },
];
