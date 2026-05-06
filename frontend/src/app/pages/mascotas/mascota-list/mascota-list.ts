import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Mascota } from '../../../services/mascota';
import { Auth} from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mascota-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css',
})
export class MascotaList implements OnInit {
  mascotas: any[] = [];
  rol: string = '';
  
  constructor(
    private authService: Auth,
    private mascotaService: Mascota,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    console.log('Rol detectado:', this.rol);

    if(this.rol){
      this.cargarMascotas();
    } else {
      console.warn('No se pudo detectar el rol del usuario. Asegúrate de que el token esté almacenado correctamente.');
    }
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe({
      next: (data) => {
        console.log('Mascotas cargadas:', data);
        this.mascotas = data;
        this.cdr.markForCheck(); // Asegura que Angular detecte los cambios
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
      }
    });
  }

  eliminarMascota(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      this.mascotaService.eliminarMascota(id).subscribe({
        next: () => {
          this.mascotas = this.mascotas.filter(mascota => mascota.id !== id);
          alert('Mascota eliminada correctamente');
          this.cargarMascotas(); // Recarga la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar mascota:', err);
        }
      });
    }
  }
}
