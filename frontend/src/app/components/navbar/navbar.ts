import { Component } from '@angular/core';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}
