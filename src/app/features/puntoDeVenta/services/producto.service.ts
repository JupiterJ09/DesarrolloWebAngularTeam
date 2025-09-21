// src/app/services/producto.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IItemVenta } from '../models/vental.model';
import { ProductoCreateDto, ProductoUpdateDto, ITotalesCarrito } from '../models/producto.dto';
import { ProductoError } from '../errors/producto.error';
import { ProductoValidator } from '../validators/producto.validator';
import { PrecioCalculatorService } from './precio-calculator.service';
import { IdGeneratorService } from './id-generator.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Estado reactivo
  private readonly _productos$ = new BehaviorSubject<IItemVenta[]>([]);
  public readonly productos$: Observable<IItemVenta[]> = this._productos$.asObservable();

  constructor(
    private validator: ProductoValidator,
    private calculator: PrecioCalculatorService,
    private idGenerator: IdGeneratorService
  ) {}

  // GETTERS PÚBLICOS
  get productos(): ReadonlyArray<IItemVenta> {
    return this._productos$.value;
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get isEmpty(): boolean {
    return this.productos.length === 0;
  }

  // OPERACIONES CRUD
  /**
   * Agrega un nuevo producto al carrito
   * @param dto - Datos del producto a agregar
   * @throws ProductoError si los datos son inválidos
   * @returns El producto creado
   */
  agregarProducto(dto: ProductoCreateDto): IItemVenta {
    this.validator.validateCreate(dto);

    const nuevoProducto: IItemVenta = {
      cns: this.idGenerator.generateProductoId(),
      nombreProducto: dto.nombreProducto.trim(),
      precioUnitario: dto.precioUnitario,
      cantidad: dto.cantidad,
      precioTotal: this.calculator.calcularPrecioTotal(dto.precioUnitario, dto.cantidad)
    };

    const productosActuales = this._productos$.value;
    this._productos$.next([...productosActuales, nuevoProducto]);

    return nuevoProducto;
  }

  /**
   * Busca un producto por su CNS
   * @param cns - Código único del producto
   * @returns El producto encontrado o undefined
   */
  buscarProducto(cns: number): IItemVenta | undefined {
    this.validator.validateCns(cns);
    return this.productos.find(item => item.cns === cns);
  }

  /**
   * Obtiene un producto por CNS (lanza error si no existe)
   * @param cns - Código único del producto
   * @throws ProductoError si el producto no existe
   * @returns El producto encontrado
   */
  obtenerProducto(cns: number): IItemVenta {
    const producto = this.buscarProducto(cns);
    if (!producto) {
      throw ProductoError.productoNotFound(cns);
    }
    return producto;
  }

  /**
   * Actualiza un producto existente
   * @param cns - Código único del producto
   * @param updateDto - Campos a actualizar
   * @throws ProductoError si el producto no existe o los datos son inválidos
   * @returns El producto actualizado
   */
  actualizarProducto(cns: number, updateDto: ProductoUpdateDto): IItemVenta {
    this.validator.validateCns(cns);
    this.validator.validateUpdate(updateDto);

    const productoIndex = this.findProductoIndex(cns);
    if (productoIndex === -1) {
      throw ProductoError.productoNotFound(cns);
    }

    const productosActuales = [...this._productos$.value];
    const productoActual = productosActuales[productoIndex];
    
    const productoActualizado: IItemVenta = {
      ...productoActual,
      ...updateDto,
      precioTotal: this.calculator.calcularPrecioTotal(
        updateDto.precioUnitario ?? productoActual.precioUnitario,
        updateDto.cantidad ?? productoActual.cantidad
      )
    };

    productosActuales[productoIndex] = productoActualizado;
    this._productos$.next(productosActuales);

    return productoActualizado;
  }

  /**
   * Elimina un producto del carrito
   * @param cns - Código único del producto a eliminar
   * @throws ProductoError si el producto no existe
   */
  eliminarProducto(cns: number): void {
    this.validator.validateCns(cns);

    const productosActuales = this._productos$.value;
    const productosFiltered = productosActuales.filter(item => item.cns !== cns);
    
    if (productosFiltered.length === productosActuales.length) {
      throw ProductoError.productoNotFound(cns);
    }

    this._productos$.next(productosFiltered);
  }

  // OPERACIONES DE CARRITO
  /**
   * Calcula los totales del carrito
   * @returns Objeto con subtotal, IVA y total
   */
  calcularTotales(): ITotalesCarrito {
    return this.calculator.calcularTotalesCarrito(this.productos);
  }

  /**
   * Vacía completamente el carrito
   */
  limpiarCarrito(): void {
    this._productos$.next([]);
  }

  /**
   * Incrementa la cantidad de un producto
   * @param cns - Código único del producto
   * @param incremento - Cantidad a incrementar (default: 1)
   */
  incrementarCantidad(cns: number, incremento: number = 1): IItemVenta {
    const producto = this.obtenerProducto(cns);
    return this.actualizarProducto(cns, { 
      cantidad: producto.cantidad + incremento 
    });
  }

  /**
   * Decrementa la cantidad de un producto
   * @param cns - Código único del producto
   * @param decremento - Cantidad a decrementar (default: 1)
   */
  decrementarCantidad(cns: number, decremento: number = 1): IItemVenta {
    const producto = this.obtenerProducto(cns);
    const nuevaCantidad = Math.max(1, producto.cantidad - decremento);
    
    return this.actualizarProducto(cns, { 
      cantidad: nuevaCantidad 
    });
  }

  // UTILIDADES
  /**
   * Obtiene un resumen del carrito para debugging
   */
  getResumenCarrito(): string {
    const total = this.totalProductos;
    const { subtotal, iva, total: totalFinal } = this.calcularTotales();
    
    return `Carrito: ${total} productos | Subtotal: $${subtotal} | IVA: $${iva} | Total: $${totalFinal}`;
  }

  /**
   * Verifica si existe un producto con el CNS dado
   * @param cns - Código único del producto
   * @returns true si existe, false si no
   */
  existeProducto(cns: number): boolean {
    try {
      this.validator.validateCns(cns);
      return this.productos.some(item => item.cns === cns);
    } catch {
      return false;
    }
  }

  // MÉTODO PRIVADO
  private findProductoIndex(cns: number): number {
    return this._productos$.value.findIndex(item => item.cns === cns);
  }
}