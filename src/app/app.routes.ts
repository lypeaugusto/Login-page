import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';

import { AuthGuard } from './services/auth-guard';
import { UserComponent } from './pages/user/user';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },

    {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit-user',
        loadComponent: () => import('./pages/edit-user/edit-user').then(m => m.EditUser),
        canActivate: [AuthGuard]
    }
];
