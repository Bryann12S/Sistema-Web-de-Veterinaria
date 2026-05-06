import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mascota } from '../../../services/mascota';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';



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
  
  constructor(
    private fb: FormBuilder,
    private mascotaService: Mascota,
    private router: Router
  ) {
    //Definimos el formulario y sus reglas
    this.mascotaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required]
    });
  }

  ngOnInit(): void {  }

  onSubmit(){
    if (this.mascotaForm.valid) {
      this.mascotaService.crearMascota(this.mascotaForm.value).subscribe({
        next: () => {
          alert('Mascota agregada exitosamente');
          this.router.navigate(['/mascotas']);
        },
        error: (err) => console.error('Error al agregar mascota', err)
      });
    }
  }

  
}
