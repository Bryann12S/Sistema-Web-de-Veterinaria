import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage = '';

  constructor(
    private authService: Auth, 
    private router: Router
  ) {}

  onRegistro(){
    if(this.usuario.password !== this.usuario.confirmPassword){
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.registro(this.usuario).subscribe({
      next: () => {
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.errorMessage = err.error?.error || 'Ocurrió un error al registrarse. Verifica tus datos.';
      }
    });
  }
}
