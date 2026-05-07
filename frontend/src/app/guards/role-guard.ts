import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Guard que verifica rol del usuario.
 * Uso en routes: canActivate: [roleGuard('admin', 'veterinario')]
 */
export const roleGuard = (...rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const data = localStorage.getItem('user');

    if (!data || data === 'undefined') {
      router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(data);
      if (rolesPermitidos.includes(user.rol)) {
        return true;
      }
      // Redirigir al dashboard si no tiene permiso
      router.navigate(['/app/dashboard']);
      return false;
    } catch {
      router.navigate(['/login']);
      return false;
    }
  };
};
