import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MascotaList } from './pages/mascotas/mascota-list/mascota-list';
import { MascotaForm } from './pages/mascotas/mascota-form/mascota-form';
import { CitaForm } from './pages/cita/cita-form/cita-form';
import { CitaList } from './pages/cita/cita-list/cita-list';
import { HistorialForm } from './pages/historial/historial-form/historial-form';
import { HistorialList } from './pages/historial/historial-list/historial-list';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: 'app',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard },

            // Mascotas — todos los roles autenticados
            { path: 'mascotas-list', component: MascotaList },
            { path: 'mascotas-form', component: MascotaForm },
            { path: 'mascotas/editar/:id', component: MascotaForm },

            // Citas: agendar → solo cliente
            {
                path: 'cita-form',
                component: CitaForm,
                canActivate: [roleGuard('cliente')]
            },

            // Citas: lista → cliente (sus citas), veterinario y admin (todas)
            {
                path: 'cita-list',
                component: CitaList,
                canActivate: [roleGuard('cliente', 'veterinario', 'admin')]
            },

            // Historial: lista por mascota
            {
                path: 'historial-list/:id',
                component: HistorialList,
                canActivate: [roleGuard('cliente', 'veterinario', 'admin')]
            },

            // Historial: crear → veterinario y admin
            {
                path: 'historial-form',
                component: HistorialForm,
                canActivate: [roleGuard('veterinario', 'admin')]
            },
        ]
    },
    { path: '**', redirectTo: 'login' }
];
