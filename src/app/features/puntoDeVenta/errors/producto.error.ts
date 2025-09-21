// src/app/errors/producto.error.ts
export class ProductoError extends Error {
    constructor(message: string, public code: string, public statusCode: number = 400) {
      super(message);
      this.name = 'ProductoError';
    }
  
    static invalidCns(): ProductoError {
      return new ProductoError('CNS inválido', 'INVALID_CNS', 400);
    }
  
    static productoNotFound(cns: number): ProductoError {
      return new ProductoError(`Producto con CNS ${cns} no encontrado`, 'PRODUCTO_NOT_FOUND', 404);
    }
  
    static invalidNombre(): ProductoError {
      return new ProductoError('El nombre del producto es requerido', 'INVALID_NOMBRE', 400);
    }
  
    static invalidPrecio(minPrecio: number): ProductoError {
      return new ProductoError(`El precio debe ser mayor a $${minPrecio}`, 'INVALID_PRECIO', 400);
    }
  
    static invalidCantidad(minCantidad: number): ProductoError {
      return new ProductoError(`La cantidad debe ser un entero mayor o igual a ${minCantidad}`, 'INVALID_CANTIDAD', 400);
    }
  }