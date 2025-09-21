import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'calculadora-rfc',
    loadComponent: () =>
      import('./features/shared/pages/under-construction.component')
        .then(c => c.UnderConstructionComponent),
    data: { titulo: 'Calculadora RFC' }
  },
  {
    path: 'punto-venta',
    loadComponent: () =>
      import('./features/puntoVenta/pages/punto-venta.component')
        .then(c => c.PuntoVentaComponent),
    data: { titulo: 'Punto de Venta' }
  },
  {
    path: 'consumidor-api',
    loadComponent: () =>
      import('./features/shared/pages/under-construction.component')
        .then(c => c.UnderConstructionComponent),
    data: { titulo: 'Consumidor API' }
  }
];
