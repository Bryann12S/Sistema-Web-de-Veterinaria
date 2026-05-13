import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Cita } from '../../../services/cita';
import { Auth } from '../../../services/auth';
import { Mascota } from '../../../services/mascota';
import { UsuarioService } from '../../../services/usuario.service';
import { Historial } from '../../../services/historial';
import { Vacuna } from '../../../services/vacuna';

declare var bootstrap: any;

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  
  // Time slots
  horariosDisponibles = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  diasSemana: any[] = [];
  ocupadasPorFecha: { [fecha: string]: string[] } = {};
  
  // Asignar Veterinario
  citaSeleccionadaParaVet: any = null;
  nuevoVetId: string = '';

  // Historial Medico
  historialActual: any = {
    cita_id: '', mascota_id: '', diagnostico: '', peso: '', temperatura: '', tratamiento: '', notas: '', proxima_visita: ''
  };
  citaParaHistorial: any = null;

  // Vacunas
  vacunaActual: any = {
    mascota_id: '', nombre: '', fecha_aplicacion: '', proxima_dosis: '', observaciones: ''
  };

  constructor(
    private citaService: Cita,
    private authService: Auth,
    private mascotaService: Mascota,
    private usuarioService: UsuarioService,
    private historialService: Historial,
    private vacunaService: Vacuna,
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
    this.ocupadasPorFecha = {};
    this.generarDiasSemana();
    const modal = new bootstrap.Modal(document.getElementById('modalCita'));
    modal.show();
  }

  formatearFechaLocal(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  generarDiasSemana() {
    this.diasSemana = [];
    const hoy = new Date();
    
    let diasAgregados = 0;
    let fechaIteracion = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // Medianoche local
    
    while (diasAgregados < 5) { // Lunes a Viernes de esta/próxima semana
      const diaSemana = fechaIteracion.getDay(); 
      if (diaSemana !== 0 && diaSemana !== 6) {
        
        const fechaStr = this.formatearFechaLocal(fechaIteracion);
        const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        this.diasSemana.push({
          fecha: fechaStr,
          diaNombre: nombresDias[diaSemana],
          diaNum: fechaIteracion.getDate()
        });

        // Consultamos la disponibilidad por cada día (no es lo más óptimo pero funciona bien para 5 días)
        this.citaService.getHorasOcupadas(fechaStr).subscribe({
          next: (ocupadas) => {
            this.ocupadasPorFecha[fechaStr] = ocupadas;
          }
        });

        diasAgregados++;
      }
      fechaIteracion.setDate(fechaIteracion.getDate() + 1);
    }
  }

  isSlotOcupado(fecha: string, horaStr: string): boolean {
    return this.ocupadasPorFecha[fecha] && this.ocupadasPorFecha[fecha].includes(horaStr);
  }

  isSlotPasado(fecha: string, horaStr: string): boolean {
    const hoy = new Date();
    const [hora, min] = horaStr.split(':').map(Number);
    if (fecha === this.formatearFechaLocal(hoy) && hoy.getHours() >= hora) {
      return true;
    }
    return false;
  }

  isSlotDeshabilitadoGrilla(fecha: string, horaStr: string): boolean {
    return this.isSlotOcupado(fecha, horaStr) || this.isSlotPasado(fecha, horaStr);
  }

  seleccionarSlot(fecha: string, horaStr: string) {
    if (this.isSlotDeshabilitadoGrilla(fecha, horaStr)) return;
    this.citaActual.fecha = fecha;
    this.citaActual.hora = horaStr;
  }

  formatSlot(hora: string): string {
    const h = parseInt(hora.split(':')[0], 10);
    return `${h}:00 - ${h + 1}:00`;
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
          
          if (nuevoEstado === 'completada' && (this.rol === 'veterinario' || this.rol === 'admin')) {
             const citaCompletada = this.citas.find(c => c.id === id);
             if (citaCompletada && confirm('¿Deseas completar el historial médico ahora?')) {
                 this.abrirModalHistorial(citaCompletada);
             }
          }
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

  abrirModalHistorial(cita: any) {
    this.citaParaHistorial = cita;
    this.historialActual = {
      cita_id: cita.id,
      mascota_id: cita.mascota_id,
      diagnostico: '',
      peso: '',
      temperatura: '',
      tratamiento: '',
      notas: '',
      proxima_visita: ''
    };
    const modal = new bootstrap.Modal(document.getElementById('modalHistorial'));
    modal.show();
  }

  guardarHistorial() {
    this.historialService.crearHistorial(this.historialActual).subscribe({
      next: () => {
        this.cerrarModal('modalHistorial');
        this.mostrarAviso('Historial médico creado exitosamente.');
        this.cargarDatos();

        // Mostrar módulo vacunas automáticamente según tipo_consulta
        if (this.citaParaHistorial && 
           ['Vacunación', 'Control', 'General'].includes(this.citaParaHistorial.tipo_consulta)) {
           if (confirm('El tipo de consulta sugiere vacunación. ¿Deseas aplicar una vacuna ahora?')) {
             this.abrirModalVacuna(this.citaParaHistorial);
           }
        }
      },
      error: (err) => alert(err.error?.error || 'Error al crear historial médico')
    });
  }

  abrirModalVacuna(cita: any) {
    this.vacunaActual = {
      mascota_id: cita.mascota_id,
      nombre: '',
      fecha_aplicacion: this.formatearFechaLocal(new Date()),
      proxima_dosis: '',
      observaciones: ''
    };
    const modal = new bootstrap.Modal(document.getElementById('modalVacuna'));
    modal.show();
  }

  guardarVacuna() {
    this.vacunaService.crearVacuna(this.vacunaActual).subscribe({
      next: () => {
        this.cerrarModal('modalVacuna');
        this.mostrarAviso('Vacuna aplicada y registrada exitosamente.');
      },
      error: (err) => alert(err.error?.error || 'Error al registrar vacuna')
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
