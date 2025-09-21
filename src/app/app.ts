import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './features/dashboard/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent], // 👈 agrega Sidebar aquí
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],                 // si tuvieras app.scss
})
export class App {}
