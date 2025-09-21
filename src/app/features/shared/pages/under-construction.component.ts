// src/app/features/shared/pages/under-construction.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="mx-auto max-w-xl p-6">
      <h2 style="margin:0 0 8px 0;">{{ titulo }}</h2>
      <p>Esta sección está en construcción. Vuelve pronto. 🚧</p>

      <div style="margin-top:16px;">
        <a routerLink="/dashboard">← Volver al dashboard</a>
      </div>
    </section>
  `
})
export class UnderConstructionComponent {
  private route = inject(ActivatedRoute);
  titulo = this.route.snapshot.data['titulo'] ?? 'En construcción';
}
