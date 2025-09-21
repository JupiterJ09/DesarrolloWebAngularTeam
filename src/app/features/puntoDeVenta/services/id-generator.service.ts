// src/app/services/id-generator.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {
  private contadorProducto = 1;
  private contadorFactura = 1000;

  /**
   * Genera el próximo ID para productos
   * @returns Nuevo ID único para producto
   */
  generateProductoId(): number {
    return this.contadorProducto++;
  }

  /**
   * Genera el próximo ID para facturas
   * @returns Nuevo ID único para factura
   */
  generateFacturaId(): number {
    return this.contadorFactura++;
  }

  /**
   * Genera un UUID v4 para identificadores únicos
   * @returns UUID v4 string
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Reinicia los contadores (útil para testing)
   */
  resetCounters(): void {
    this.contadorProducto = 1;
    this.contadorFactura = 1000;
  }

  /**
   * Obtiene el próximo ID sin incrementar (peek)
   * @returns El próximo ID que se generaría
   */
  peekNextProductoId(): number {
    return this.contadorProducto;
  }
}