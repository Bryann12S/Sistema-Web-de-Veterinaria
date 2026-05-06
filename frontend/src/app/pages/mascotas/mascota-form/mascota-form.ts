import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mascota } from '../../../services/mascota';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route } from '@angular/router';



@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css',
})
export class MascotaForm implements OnInit{
  mascotaForm: FormGroup;
  especies = ['Perro', 'Gato', 'Pájaro', 'Otro'];
  isEditMode: boolean = false;
  mascotaId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private mascotaService: Mascota,
    private router: Router,
    private route: ActivatedRoute
  ) {
    //Definimos el formulario y sus reglas
    this.mascotaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required]
    });
  }

  ngOnInit(): void {  
    //Verificamos si hay un id
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.mascotaId = +id;
      this.cargarDatosMascota(this.mascotaId);
    }
  }
  
  cargarDatosMascota(id: number) {

    this.mascotaService.getMascotaById(id.toString()).subscribe({
      next: (mascota) => {
        this.mascotaForm.patchValue({
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza
        });
      },
      error: (err) => {
        console.error('Error al cargar datos de la mascota:', err);
      }
    });
  }

  onSubmit(){
    if (this.isEditMode && this.mascotaId) {
      // MODO EDICIÓN
      this.mascotaService.actualizarMascota(this.mascotaId.toString(), this.mascotaForm.value).subscribe({
        next: () => {
          alert('Mascota actualizada con éxito');
          this.router.navigate(['/app/mascotas']);
        },
        error: (err) => {
          alert('Error al actualizar mascota:' + err.error.message);
        }
      });
    }else {
      // MODO CREACIÓN
      this.mascotaService.crearMascota(this.mascotaForm.value).subscribe({
        next: () => {
          alert('Mascota registrada con éxito');
          this.router.navigate(['/app/mascotas']);
        }
      });
    }
  }
  
}
