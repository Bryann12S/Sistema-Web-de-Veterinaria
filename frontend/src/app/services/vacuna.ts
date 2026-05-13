import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Vacuna {
  private apiUrl = 'http://localhost:3000/api/vacunas';

  constructor(private http: HttpClient) {}

  // Listar todas (admin/vet)
  getVacunas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener por mascota
  getVacunasPorMascota(mascotaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mascota/${mascotaId}`);
  }

  // Obtener próximas dosis (admin/vet)
  getProximasDosis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proximas/dosis`);
  }

  // Registrar vacuna
  crearVacuna(vacuna: any): Observable<any> {
    return this.http.post(this.apiUrl, vacuna);
  }

  // Actualizar
  actualizarVacuna(id: number, vacuna: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vacuna);
  }

  // Eliminar
  eliminarVacuna(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
