import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OpcionMenu } from '../../models/menu.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,                        
  imports: [CommonModule, RouterModule],   
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  opcionesMenu: OpcionMenu[] = [
    { id: 'home', titulo: 'Inicio', icono: '🏠', ruta: '/dashboard' },
    { id: 'rfc', titulo: 'Calculadora RFC', icono: '🧮', ruta: '/rfc' },
    { id: 'pos', titulo: 'Punto de Venta', icono: '🛒', ruta: '/pos' },
    { id: 'api', titulo: 'Consumidor API', icono: '🌐', ruta: '/api' }
  ];

  constructor(private router: Router) {}

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
