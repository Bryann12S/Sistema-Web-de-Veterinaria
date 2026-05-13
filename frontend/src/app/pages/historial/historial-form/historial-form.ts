import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Historial } from '../../../services/historial';
import { Mascota } from '../../../services/mascota';
import { Cita } from '../../../services/cita';

@Component({
  selector: 'app-historial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial-form.html',
  styleUrl: './historial-form.css',
})
export class HistorialForm implements OnInit {
  historialForm: FormGroup;
  mascotas: any[] = [];
  citas: any[] = [];

  constructor(
    private historialService: Historial,
    private mascotaService: Mascota,
    private citaService: Cita,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.historialForm = this.fb.group({
      mascota_id: ['', Validators.required],
      cita_id: [''],
      peso: [''],
      temperatura: [''],
      diagnostico: ['', Validators.required],
      tratamiento: [''],
      notas: [''],
      proxima_visita: ['']
    });
  }

  ngOnInit() {
    this.mascotaService.getMascotas().subscribe(data => this.mascotas = data);
    this.citaService.getCitas().subscribe(data => this.citas = data);
  }

  onCrear() {
    if (this.historialForm.valid) {
      this.historialService.crearHistorial(this.historialForm.value).subscribe({
        next: () => {
          alert('Historial creado exitosamente');
          this.router.navigate(['app/historial-list', this.historialForm.value.mascota_id]);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
