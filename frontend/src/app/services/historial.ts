import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Historial {
  private apiUrl = 'http://localhost:3000/api/historial';

  constructor(private http: HttpClient) {}

  // Obtener historial por mascota
  getHistorialPorMascota(mascotaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mascota/${mascotaId}`);
  }

  // Crear nuevo historial
  crearHistorial(historial: any): Observable<any> {
    return this.http.post(this.apiUrl, historial);
  }
}