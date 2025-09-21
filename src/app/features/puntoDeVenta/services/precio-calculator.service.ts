import { Injectable } from '@angular/core';
import { IItemVenta } from '../models/vental.model';
import { ITotalesCarrito } from '../models/producto.dto';
import { PRODUCTO_CONFIG } from '../constants/producto.constants';

@Injectable({
  providedIn: 'root'
})
export class PrecioCalculatorService {

  /**
   * Calcula el precio total de un producto
   * @param precioUnitario - Precio por unidad
   * @param cantidad - Cantidad de productos
   * @returns Precio total redondeado
   */
  calcularPrecioTotal(precioUnitario: number, cantidad: number): number {
    const total = precioUnitario * cantidad;
    return this.roundCurrency(total);
  }

  /**
   * Calcula los totales del carrito (subtotal, IVA, total)
   * @param productos - Lista de productos
   * @returns Objeto con los totales calculados
   */
  calcularTotalesCarrito(productos: readonly IItemVenta[]): ITotalesCarrito {
    const subtotal = productos.reduce((acc, item) => acc + item.precioTotal, 0);
    const iva = subtotal * PRODUCTO_CONFIG.IVA_RATE;
    const total = subtotal + iva;

    return {
      subtotal: this.roundCurrency(subtotal),
      iva: this.roundCurrency(iva),
      total: this.roundCurrency(total)
    };
  }

  /**
   * Calcula descuentos aplicables
   * @param subtotal - Subtotal del carrito
   * @param codigoDescuento - Código de descuento opcional
   * @returns Monto del descuento
   */
  calcularDescuento(subtotal: number, codigoDescuento?: string): number {
    if (!codigoDescuento) return 0;

    // Lógica de descuentos (ejemplo)
    const descuentos = {
      'DESCUENTO10': 0.10,
      'DESCUENTO20': 0.20,
      'PRIMERAVEZ': 0.15
    };

    const porcentajeDescuento = descuentos[codigoDescuento as keyof typeof descuentos] || 0;
    const descuento = subtotal * porcentajeDescuento;
    
    return this.roundCurrency(descuento);
  }

  /**
   * Redondea un monto a 2 decimales (para moneda)
   * @param amount - Monto a redondear
   * @returns Monto redondeado
   */
  roundCurrency(amount: number): number {
    return Math.round(amount * 100) / 100;
  }

  /**
   * Formatea un número como moneda
   * @param amount - Monto a formatear
   * @param currency - Código de moneda (default: MXN)
   * @returns String formateado como moneda
   */
  formatCurrency(amount: number, currency: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}