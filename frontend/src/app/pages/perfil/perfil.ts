import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  errorMessage = '';
  cedulaExistente = false;
  isLoading = true;
  showToast = false;

  // Provincias de Ecuador
  provincias = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 
    'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 
    'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 
    'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'
  ];

  constructor(private authService: Auth, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.isLoading = true;
    this.authService.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data;
        if (this.usuario.cedula) {
          this.cedulaExistente = true;
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar actualización de vista
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  actualizarPerfil() {
    this.authService.actualizarPerfil(this.usuario).subscribe({
      next: () => {
        this.errorMessage = '';
        this.showToast = true;
        this.cdr.detectChanges();
        
        // Ocultar toast después de 3 segundos
        setTimeout(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.errorMessage = err.error?.error || 'Hubo un error al actualizar el perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.foto = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
