import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Vacuna } from '../../../services/vacuna';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-vacunas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacunas-list.html',
  styleUrl: './vacunas-list.css',
})
export class VacunasList implements OnInit {
  vacunas: any[] = [];
  cargando: boolean = false;
  errorMsg: string = '';
  
  viewType: 'todas' | 'proximas' | 'carnet' = 'todas';
  mascotaId: number | null = null;
  rol: string = '';

  constructor(
    private vacunaService: Vacuna,
    private authService: Auth,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.rol = (this.authService.getRol() ?? '').toLowerCase().trim();
    
    // Determinamos qué vista mostrar basándonos en la ruta
    const urlSegment = this.route.snapshot.url[0]?.path;
    
    if (urlSegment === 'vacunas-proximas') {
      this.viewType = 'proximas';
    } else if (urlSegment === 'carnet-vacunas') {
      this.viewType = 'carnet';
      this.mascotaId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.viewType = 'todas';
    }

    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    let peticion;

    if (this.viewType === 'proximas') {
      peticion = this.vacunaService.getProximasDosis();
    } else if (this.viewType === 'carnet' && this.mascotaId) {
      peticion = this.vacunaService.getVacunasPorMascota(this.mascotaId);
    } else {
      peticion = this.vacunaService.getVacunas();
    }

    peticion.pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.vacunas = data;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al cargar las vacunas.';
      }
    });
  }

  eliminarVacuna(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro de vacuna?')) {
      this.vacunaService.eliminarVacuna(id).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => alert(err.error?.error || 'Error al eliminar vacuna')
      });
    }
  }

  getTitulo(): string {
    if (this.viewType === 'proximas') return 'Próximas Dosis de Vacunas (30 días)';
    if (this.viewType === 'carnet') return 'Carnet de Vacunación';
    return 'Registro General de Vacunas';
  }
}
