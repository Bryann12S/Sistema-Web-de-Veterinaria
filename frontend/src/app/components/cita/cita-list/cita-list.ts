import { Component, OnInit } from '@angular/core';
import { Cita } from '../../../services/cita';
import { Auth } from '../../../services/auth'
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList implements OnInit {
  citas: any[] = [];
  rol: string = '';

  constructor(
    private citaService: Cita,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.rol = this.authService.getRol()
  }

  cargarcitas(){
    this.citaService.getCitas().subscribe(data => this.citas = data);
  }

  actualizarEstado(id: number, nuevoEstado: string){
    this.citaService.actualizarCita(id, nuevoEstado).subscribe(()=>{
      this.cargarcitas();
    })
  }
}
