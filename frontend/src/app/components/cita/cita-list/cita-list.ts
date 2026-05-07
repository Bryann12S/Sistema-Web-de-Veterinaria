import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Cita } from '../../../services/cita';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [NgClass, CommonModule, RouterLink],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList implements OnInit {
  citas: any[] = [];
  rol: string = '';
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private citaService: Cita,
    private authService: Auth,
    private cdr: ChangeDetectorRef  // <-- detecta cambios manualmente si Angular no lo hace
  ) { }

  ngOnInit() {
    this.rol = (this.authService.getRol() ?? '').toLowerCase().trim();
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando = true;
    this.errorMsg = '';
    this.cdr.detectChanges(); // Muestra el spinner de inmediato

    this.citaService.getCitas().pipe(
      // finalize garantiza que cargando=false SIEMPRE, incluso si hay error inesperado
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
      })
    ).subscribe({
      next: (data) => {
        this.citas = data;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || err.error?.message || 'Error al cargar las citas. Verifica tu sesión.';
      }
    });
  }

  // Solo veterinario puede cambiar estado
  actualizarEstado(id: number, nuevoEstado: string) {
    if (this.rol !== 'veterinario') return;

    this.citaService.actualizarCita(id, { estado: nuevoEstado }).subscribe({
      next: () => this.cargarCitas(),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al actualizar el estado.';
        this.cdr.detectChanges();
      }
    });
  }

  // Helpers de vista
  esVeterinario(): boolean { return this.rol === 'veterinario'; }
  esAdmin(): boolean { return this.rol === 'admin'; }
  esCliente(): boolean { return this.rol === 'cliente'; }

  badgeEstado(estado: string): string {
    const mapa: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      confirmada: 'bg-info text-dark',
      completada: 'bg-success',
      cancelada: 'bg-danger',
    };
    return mapa[estado] ?? 'bg-secondary';
  }
}
