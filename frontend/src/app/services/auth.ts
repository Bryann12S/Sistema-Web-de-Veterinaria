import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private API_URL = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  login(credentials: any){
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.usuario)); //Buscamos los datos
        }
      })
    );
  }

  logaut() {
    localStorage.clear();
  }

  getRol(){
    const data = localStorage.getItem('user');
    if (data && data !== 'undefined'){
      try{
        const user = JSON.parse(data);
        return user.rol || null;
      }catch (e){
        console.error('Error al parsear el usuario:', e);
        return null;
      }
    }

    return null;
  }

  hasRol(roles: string[]): boolean {
    return roles.includes(this.getRol());
  }
}
