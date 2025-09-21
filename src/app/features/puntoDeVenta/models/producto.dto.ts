export interface ProductoCreateDto {
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
  }
  
  export interface ProductoUpdateDto {
    cantidad?: number;
    precioUnitario?: number;
  }
  
  export interface ITotalesCarrito {
    subtotal: number;
    iva: number;
    total: number;
  }
  