import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Faltaba Validators
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Cita } from '../../../services/cita';
import {Mascota} from '../../../services/mascota'

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css',
})
export class CitaForm implements OnInit {
  citaForm: FormGroup;
  tiposConsulta = ['General', 'Vacunación', 'Desparacitación', 'Cirugía', 'Urgencia', 'Estética', 'Control']
  misMascotas: any[] = [];

  constructor(
    private citaService: Cita,
    private mascotaService: Mascota,
    private router: Router,
    private fb: FormBuilder
  ){
    this.citaForm = this.fb.group({
      mascota_id: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      tipo_consulta: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.mascotaService.getMascotas().subscribe(data => this. misMascotas = data);
  }

  onAgendar() {
    if (this.citaForm.valid) {
      this.citaService.agendarCita(this.citaForm.value).subscribe({
        next: () => {
          alert('Cita solicitada');
          this.router.navigate(['app/cita-form']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
