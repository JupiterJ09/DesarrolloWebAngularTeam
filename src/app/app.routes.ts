// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/home/home.component')
        .then(c => c.HomeComponent),
  },
  {
    path: 'puntoVenta',
    loadComponent: () =>
      import('./features/puntoDeVenta/pages/carrito.page')
        .then(c => c.CarritoPage),
  },
  { path: '**', redirectTo: '/dashboard' },
];
