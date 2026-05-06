import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mascota {
  private API_URL = 'http://localhost:3000/api/mascotas';
  
  constructor(private http: HttpClient) {}

  getMascotas(): Observable<any> {
    return this.http.get(this.API_URL);
  }


  crearMascota(mascota: any): Observable<any> {
    return this.http.post(this.API_URL, mascota);
  }

  actualizarMascota(id: string, mascota: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, mascota);
  }

  getMascotaById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }
  
  eliminarMascota(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
