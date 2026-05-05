import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: Login},
    {
        path: 'app',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {path: 'dashboard', component: Dashboard}
        ]
    },
    { path: '**', redirectTo: 'login' }
];
