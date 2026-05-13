import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cita {
  private apiUrl = 'http://localhost:3000/api/citas';

  constructor(private http: HttpClient) {}

  //Get citaas Veterinario/admin
  getCitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //post clientes
  agendarCita(cita: any): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  getHorasOcupadas(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ocupadas/${fecha}`);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }

  asignarVeterinario(id: number, veterinario_id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/veterinario`, { veterinario_id });
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
