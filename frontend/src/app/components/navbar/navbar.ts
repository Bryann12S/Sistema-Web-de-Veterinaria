import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
    rol: string | null = null;

    constructor(private authService: Auth, private router: Router) {}
    
    ngOnInit() {
        this.rol = this.authService.getRol();
    }

    isLoggedIn(): boolean {
        return !!this.authService.getRol();
    }
    
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
