export const PRODUCTO_CONFIG = {
    IVA_RATE: 0.16,
    MIN_CANTIDAD: 1,
    MIN_PRECIO: 0.01,
    MAX_NOMBRE_LENGTH: 100
  } as const;
  
  export const PRODUCTO_ERRORS = {
    INVALID_CNS: 'INVALID_CNS',
    PRODUCTO_NOT_FOUND: 'PRODUCTO_NOT_FOUND',
    INVALID_NOMBRE: 'INVALID_NOMBRE',
    INVALID_PRECIO: 'INVALID_PRECIO',
    INVALID_CANTIDAD: 'INVALID_CANTIDAD'
  } as const;

  export const CARRITO_MESSAGES = {
    PRODUCTO_AGREGADO: 'Producto agregado exitosamente',
    PRODUCTO_ELIMINADO: 'Producto eliminado del carrito',
    PRODUCTO_ACTUALIZADO: 'Producto actualizado',
    CARRITO_VACIO: 'El carrito está vacío',
    CARRITO_LIMPIADO: 'Carrito vaciado exitosamente',
    ERROR_GENERICO: 'Ha ocurrido un error inesperado'
  } as const;