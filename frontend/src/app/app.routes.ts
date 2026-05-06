import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';


import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MascotaList } from './pages/mascotas/mascota-list/mascota-list';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: Login},
    {
        path: 'app',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {path: 'dashboard', component: Dashboard},
            {path: 'mascotas-list', component: MascotaList}
        ]
    },
    { path: '**', redirectTo: 'login' }
];
