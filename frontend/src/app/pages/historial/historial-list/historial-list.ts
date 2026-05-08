import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Historial } from '../../../services/historial';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-historial-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-list.html',
  styleUrl: './historial-list.css',
})
export class HistorialList implements OnInit {
  historial: any[] = [];
  mascotaId: number = 0;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private historialService: Historial,
    private authService: Auth,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mascotaId = +params['id'];
      this.cargarHistorial();
    });
  }

  cargarHistorial() {
    this.cargando = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.historialService.getHistorialPorMascota(this.mascotaId).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || err.error?.message || 'Error al cargar el historial médico.';
      }
    });
  }
}
