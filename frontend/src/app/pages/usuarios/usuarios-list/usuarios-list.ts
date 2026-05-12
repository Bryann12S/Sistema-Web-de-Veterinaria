import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';

declare var bootstrap: any; // Para manejar modales de Bootstrap

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css'
})
export class UsuariosList implements OnInit {
  usuarios: any[] = [];
  isLoading = true;
  
  // Variables para crear personal
  nuevoPersonal: any = {
    nombre: '', apellidos: '', email: '', password: '', rol: 'veterinario',
    cedula: '', telefono: '', provincia: '', canton: '', ciudad: '', comunidad: '', direccion: ''
  };

  // Variables para edición
  usuarioSeleccionado: any = null;

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear() {
    this.nuevoPersonal = { nombre: '', apellidos: '', email: '', password: '', rol: 'veterinario' };
    const modal = new bootstrap.Modal(document.getElementById('modalCrearPersonal'));
    modal.show();
  }

  crearPersonal() {
    this.usuarioService.crearPersonal(this.nuevoPersonal).subscribe({
      next: () => {
        this.cargarUsuarios();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearPersonal'));
        modal.hide();
      },
      error: (err) => alert(err.error?.error || 'Error al crear personal')
    });
  }

  abrirModalEditar(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    const modal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
    modal.show();
  }

  actualizarUsuario() {
    this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
      next: () => {
        this.cargarUsuarios();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario'));
        modal.hide();
      },
      error: (err) => alert(err.error?.error || 'Error al actualizar usuario')
    });
  }

  cambiarEstado(id: number, estadoActual: string) {
    // Alternamos estado para el ejemplo o pasamos uno específico
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    if(confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) {
      this.usuarioService.cambiarEstado(id, nuevoEstado).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => alert('Error al cambiar estado: ' + err.message)
      });
    }
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'activo': return 'bg-success';
      case 'inactivo': return 'bg-secondary';
      case 'suspendido': return 'bg-danger';
      default: return 'bg-dark';
    }
  }
}
