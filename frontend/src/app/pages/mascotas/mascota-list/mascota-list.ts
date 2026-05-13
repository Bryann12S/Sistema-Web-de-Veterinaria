import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Mascota } from '../../../services/mascota';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css',
})
export class MascotaList implements OnInit {
  mascotas: any[] = [];
  rol: string = '';
  isLoading = true;
  showToast = false;
  toastMessage = '';

  // Formulario de mascota nueva/edición
  mascotaActual: any = {
    nombre: '', especie: '', raza: '', sexo: '', color: '', peso: null, fecha_nacimiento: '', esterilizado: 0
  };
  esEdicion = false;

  constructor(
    private authService: Auth,
    private mascotaService: Mascota,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol() || '';
    if (this.rol) {
      this.cargarMascotas();
    } else {
      this.isLoading = false;
      this.mostrarAviso('Error: No se detectó tu rol.');
    }
  }

  cargarMascotas() {
    this.isLoading = true;
    this.mascotaService.getMascotas().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
        this.isLoading = false;
        this.mostrarAviso('Error al cargar la lista de mascotas.');
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear() {
    this.esEdicion = false;
    this.mascotaActual = { nombre: '', especie: '', raza: '', sexo: '', color: '', peso: null, fecha_nacimiento: '', esterilizado: 0 };
    const modal = new bootstrap.Modal(document.getElementById('modalMascota'));
    modal.show();
  }

  abrirModalEditar(mascota: any) {
    this.esEdicion = true;
    // Formatear la fecha para el input type="date"
    const fecha = mascota.fecha_nacimiento ? new Date(mascota.fecha_nacimiento).toISOString().split('T')[0] : '';
    this.mascotaActual = { ...mascota, fecha_nacimiento: fecha };
    const modal = new bootstrap.Modal(document.getElementById('modalMascota'));
    modal.show();
  }

  guardarMascota() {
    if (this.esEdicion) {
      this.mascotaService.actualizarMascota(this.mascotaActual.id, this.mascotaActual).subscribe({
        next: () => {
          this.cerrarModal();
          this.mostrarAviso('Mascota actualizada exitosamente.');
          this.cargarMascotas();
        },
        error: (err) => alert(err.error?.error || 'Error al actualizar mascota')
      });
    } else {
      this.mascotaService.crearMascota(this.mascotaActual).subscribe({
        next: () => {
          this.cerrarModal();
          this.mostrarAviso('Mascota registrada exitosamente.');
          this.cargarMascotas();
        },
        error: (err) => alert(err.error?.error || 'Error al crear mascota')
      });
    }
  }

  eliminarMascota(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar (inactivar) esta mascota?')) {
      this.mascotaService.eliminarMascota(id).subscribe({
        next: () => {
          this.mostrarAviso('Mascota eliminada correctamente.');
          this.cargarMascotas();
        },
        error: (err) => alert(err.error?.error || 'Error al eliminar mascota')
      });
    }
  }

  cerrarModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalMascota'));
    if (modal) modal.hide();
  }

  mostrarAviso(mensaje: string) {
    this.toastMessage = mensaje;
    this.showToast = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  puedeEditar(): boolean {
    return this.rol === 'cliente' || this.rol === 'admin' || this.rol === 'veterinario';
  }

  puedeEliminar(): boolean {
    return this.rol === 'cliente' || this.rol === 'admin';
  }
}
