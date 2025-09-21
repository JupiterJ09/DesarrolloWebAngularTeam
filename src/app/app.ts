import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { SidebarComponent } from './features/dashboard/components/sidebar/sidebar.component';

// src/app/app.ts  (tu archivo con AppComponent)
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  CommonModule],
  template: `
    <header class="app-header">...</header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
    <footer class="app-footer">...</footer>
  `,
})
export class AppComponent {}
