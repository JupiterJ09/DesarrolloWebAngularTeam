import { Injectable } from '@angular/core';
import { IItemVenta } from '../models/vental.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: IItemVenta[] = [];
  private contadorId = 1;

  constructor() {}

  // Getter para acceder a los productos desde el componente
  get listaProductos(): IItemVenta[] {
    return [...this.productos]; // Retorna una copia para evitar mutaciones directas
  }

  // Agregar el producto
  agregarProducto(nombreProducto: string, precioUnitario: number, cantidad: number): IItemVenta {
    const nuevoProducto: IItemVenta = {
      cns: this.contadorId++,
      nombreProducto,
      precioUnitario,
      cantidad,
      precioTotal: precioUnitario * cantidad
    };
    this.productos.push(nuevoProducto);
    console.log('Producto agregado: ', nuevoProducto);
    return nuevoProducto;
  }

  buscarProducto(cns: number): IItemVenta | undefined {
    return this.productos.find((item) => item.cns === cns);
  }

  modificarProducto(cns: number, nuevaCantidad: number): void {
    const index = this.productos.findIndex(item => item.cns === cns);
    if (index !== -1) {
      this.productos[index].cantidad = nuevaCantidad;
      this.productos[index].precioTotal = this.productos[index].precioUnitario * nuevaCantidad;
      console.log(`Producto con cns ${cns} actualizado a cantidad ${nuevaCantidad}.`);
    } else {
      console.log(`Error: No se encontró el producto con cns ${cns}.`);
    }
  }

  eliminarProducto(cns: number): void {
    const longitudInicial = this.productos.length;
    this.productos = this.productos.filter((item) => item.cns !== cns);
    const longitudFinal = this.productos.length;
    if (longitudInicial > longitudFinal) {
      console.log(`Producto con cns ${cns} eliminado.`);
    } else {
      console.log(`Error: No se encontró el producto con cns ${cns} para eliminar.`);
    }
  }

  mostrarProductos(): void {
    console.log('\nINVENTARIO DE PRODUCTOS');
    if (this.productos.length === 0) {
      console.log('No hay productos registrados');
      return;
    }
    this.productos.forEach(producto => {
      console.log(`ID: ${producto.cns} | ${producto.nombreProducto} | $${producto.precioUnitario} | Stock: ${producto.cantidad}`);
    });
    console.log(`Total de productos: ${this.productos.length}\n`);
  }

  calcularTotales(): { subtotal: number; iva: number; total: number } {
    // reduce() suma todos los precioTotal de cada producto en el arreglo.
    const subtotal = this.productos.reduce((acumulador, item) => {
      return acumulador + item.precioTotal;
    }, 0); // El '0' es el valor con el que empieza la suma.

    // Calculamos el IVA y el total final.
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Devolvemos un objeto con los totales calculados.
    return { subtotal, iva, total };
  }

  // Método para limpiar todos los productos (útil para nuevas ventas)
  limpiarProductos(): void {
    this.productos = [];
    this.contadorId = 1;
    console.log('Lista de productos limpiada.');
  }
}