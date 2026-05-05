import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //obtener el token del localStorage
  const token = localStorage.getItem('token');

  //si el token existe clonamos la solicitud y le añadimos el header de autorización
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(req);
  }
  //si no hay token, simplemente pasamos la solicitud sin modificar
  return next(req);
};
