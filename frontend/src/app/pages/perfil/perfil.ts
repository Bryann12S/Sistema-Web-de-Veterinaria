import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  usuario: any = {};
  successMessage = '';
  errorMessage = '';

  // Provincias de Ecuador
  provincias = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 
    'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 
    'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 
    'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'
  ];

  constructor(private authService: Auth) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.authService.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  actualizarPerfil() {
    this.authService.actualizarPerfil(this.usuario).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado exitosamente.';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.errorMessage = 'Hubo un error al actualizar el perfil.';
        this.successMessage = '';
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
