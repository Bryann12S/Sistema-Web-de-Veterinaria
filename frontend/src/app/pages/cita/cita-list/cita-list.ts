import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Cita } from '../../../services/cita';
import { Auth } from '../../../services/auth';
import { Mascota } from '../../../services/mascota';
import { UsuarioService } from '../../../services/usuario.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList implements OnInit {
  citas: any[] = [];
  mascotas: any[] = [];
  veterinarios: any[] = [];
  rol: string = '';
  
  isLoading = true;
  showToast = false;
  toastMessage = '';

  // Formulario cita
  citaActual: any = {
    fecha: '', hora: '', mascota_id: '', motivo: '', tipo_consulta: 'General', veterinario_id: ''
  };
  
  // Asignar Veterinario
  citaSeleccionadaParaVet: any = null;
  nuevoVetId: string = '';

  constructor(
    private citaService: Cita,
    private authService: Auth,
    private mascotaService: Mascota,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.rol = (this.authService.getRol() ?? '').toLowerCase().trim();
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.citas = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarAviso(err.error?.error || 'Error al cargar las citas.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    if (this.rol === 'cliente') {
      this.mascotaService.getMascotas().subscribe(data => {
        this.mascotas = data;
      });
    }
    
    // Todos podrian necesitar ver a los veterinarios (cliente para preferido, admin para asignar)
    this.usuarioService.obtenerVeterinarios().subscribe((data: any) => {
      this.veterinarios = data;
    });
  }

  abrirModalAgendar() {
    this.citaActual = { fecha: '', hora: '', mascota_id: '', motivo: '', tipo_consulta: 'General', veterinario_id: '' };
    const modal = new bootstrap.Modal(document.getElementById('modalCita'));
    modal.show();
  }

  guardarCita() {
    this.citaService.agendarCita(this.citaActual).subscribe({
      next: () => {
        this.cerrarModal('modalCita');
        this.mostrarAviso('Cita agendada exitosamente.');
        this.cargarDatos();
      },
      error: (err) => alert(err.error?.error || 'Error al agendar cita')
    });
  }

  actualizarEstado(id: number, nuevoEstado: string) {
    let mensajeConfirmacion = `¿Estás seguro de marcar esta cita como ${nuevoEstado.toUpperCase()}?`;
    if (nuevoEstado === 'cancelada' && this.rol === 'cliente') {
      mensajeConfirmacion = '¿Estás seguro de que deseas cancelar tu cita?';
    }

    if (confirm(mensajeConfirmacion)) {
      this.citaService.actualizarEstado(id, nuevoEstado).subscribe({
        next: () => {
          this.mostrarAviso(`Cita marcada como ${nuevoEstado}.`);
          this.cargarDatos();
        },
        error: (err) => alert(err.error?.error || 'Error al actualizar estado')
      });
    }
  }

  abrirModalAsignarVet(cita: any) {
    this.citaSeleccionadaParaVet = cita;
    this.nuevoVetId = cita.veterinario_id || '';
    const modal = new bootstrap.Modal(document.getElementById('modalAsignarVet'));
    modal.show();
  }

  asignarVeterinario() {
    this.citaService.asignarVeterinario(this.citaSeleccionadaParaVet.id, parseInt(this.nuevoVetId)).subscribe({
      next: () => {
        this.cerrarModal('modalAsignarVet');
        this.mostrarAviso('Veterinario asignado exitosamente.');
        this.cargarDatos();
      },
      error: (err) => alert(err.error?.error || 'Error al asignar veterinario')
    });
  }

  eliminarCita(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta cita del sistema?')) {
      this.citaService.eliminarCita(id).subscribe({
        next: () => {
          this.mostrarAviso('Cita eliminada correctamente.');
          this.cargarDatos();
        },
        error: (err) => alert(err.error?.error || 'Error al eliminar cita')
      });
    }
  }

  cerrarModal(id: string) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(id));
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
