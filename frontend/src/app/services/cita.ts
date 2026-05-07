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

  //put para verterinario/admin (cambiar a 'confirmada', 'completada' o 'cancelada')
  actualizarCita(id: number, cita: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, cita);
  }

}
