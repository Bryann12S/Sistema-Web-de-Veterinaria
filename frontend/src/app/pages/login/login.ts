import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {email: '', password: ''};
  errorMessage = '';

  constructor(
    private authService: Auth, 
    private router: Router
  ) {}

  onLogin(){
    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Login exitoso');
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage = 'Credenciales incorrectas, intenta de nuevo.';
      }
    });
  }
  
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/app/dashboard']);
    }
  }
}
