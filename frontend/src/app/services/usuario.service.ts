import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerTodos() {
    return this.http.get(`${this.API_URL}/todos`);
  }

  crearPersonal(datos: any) {
    return this.http.post(`${this.API_URL}/crear-personal`, datos);
  }

  actualizarUsuario(id: number, datos: any) {
    return this.http.put(`${this.API_URL}/${id}`, datos);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.put(`${this.API_URL}/${id}/estado`, { estado });
  }
}
