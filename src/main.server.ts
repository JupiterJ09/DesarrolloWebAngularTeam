// src/main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export default function bootstrap() {
  return bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes), provideAnimations()],
  });
}
