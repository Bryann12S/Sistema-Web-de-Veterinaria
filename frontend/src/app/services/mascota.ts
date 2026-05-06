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
}
