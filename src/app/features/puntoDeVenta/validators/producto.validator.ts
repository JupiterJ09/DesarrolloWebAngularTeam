import { Injectable } from '@angular/core';
import { ProductoCreateDto, ProductoUpdateDto } from '../models/producto.dto';
import { ProductoError } from '../errors/producto.error';
import { PRODUCTO_CONFIG } from '../constants/producto.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductoValidator {

  /**
   * Valida los datos para crear un producto
   * @param dto - Datos del producto a validar
   * @throws ProductoError si algún dato es inválido
   */
  validateCreate(dto: ProductoCreateDto): void {
    this.validateNombre(dto.nombreProducto);
    this.validatePrecio(dto.precioUnitario);
    this.validateCantidad(dto.cantidad);
  }

  /**
   * Valida los datos para actualizar un producto
   * @param dto - Datos a actualizar
   * @throws ProductoError si algún dato es inválido
   */
  validateUpdate(dto: ProductoUpdateDto): void {
    if (dto.cantidad !== undefined) {
      this.validateCantidad(dto.cantidad);
    }

    if (dto.precioUnitario !== undefined) {
      this.validatePrecio(dto.precioUnitario);
    }
  }

  /**
   * Valida si un CNS es válido
   * @param cns - Código a validar
   * @throws ProductoError si el CNS es inválido
   */
  validateCns(cns: number): void {
    if (!Number.isInteger(cns) || cns <= 0) {
      throw ProductoError.invalidCns();
    }
  }

  // MÉTODOS PRIVADOS DE VALIDACIÓN
  private validateNombre(nombre: string): void {
    if (!nombre?.trim()) {
      throw ProductoError.invalidNombre();
    }

    if (nombre.trim().length > PRODUCTO_CONFIG.MAX_NOMBRE_LENGTH) {
      throw new ProductoError(
        `El nombre no puede exceder ${PRODUCTO_CONFIG.MAX_NOMBRE_LENGTH} caracteres`,
        'INVALID_NOMBRE_LENGTH'
      );
    }
  }

  private validatePrecio(precio: number): void {
    if (typeof precio !== 'number' || precio < PRODUCTO_CONFIG.MIN_PRECIO) {
      throw ProductoError.invalidPrecio(PRODUCTO_CONFIG.MIN_PRECIO);
    }

    if (!Number.isFinite(precio)) {
      throw new ProductoError('El precio debe ser un número válido', 'INVALID_PRECIO_FORMAT');
    }
  }

  private validateCantidad(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad < PRODUCTO_CONFIG.MIN_CANTIDAD) {
      throw ProductoError.invalidCantidad(PRODUCTO_CONFIG.MIN_CANTIDAD);
    }
  }
}