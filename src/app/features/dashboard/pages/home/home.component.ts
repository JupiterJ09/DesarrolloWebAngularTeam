import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
  
  proyectos = [
    { nombre: 'Calculadora RFC', descripcion: 'Generar RFC', ruta: '/calculadora-rfc' },
    { nombre: 'Punto de Venta', descripcion: 'Punto de Venta', ruta: '/punto-venta' },
    { nombre: 'Consumidor API', descripcion: 'Consulta datos de APIs externas', ruta: '/consumidor-api' }
  ];
  
}