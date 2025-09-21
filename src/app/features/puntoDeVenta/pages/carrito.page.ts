// src/app/features/puntoDeVenta/pages/carrito.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';

// Servicios y modelos (tus rutas quedan igual)
import { ProductoService } from '../services/producto.service';
import { PrecioCalculatorService } from '../services/precio-calculator.service';
import { ProductoValidator } from '../validators/producto.validator';
import { IItemVenta } from '../models/vental.model';
import { ProductoError } from '../errors/producto.error';
import { CARRITO_MESSAGES } from '../constants/producto.constants';
import { ProductoCreateDto, ITotalesCarrito } from '../models/producto.dto';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG
    ToastModule,
    CardModule,
    ButtonModule,
    AccordionModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    BadgeModule,
    DividerModule,
    PanelModule,
  ],
  providers: [MessageService],
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, OnDestroy {
  productos$!: Observable<IItemVenta[]>;
  totales$!: Observable<ITotalesCarrito>;
  totalProductos$!: Observable<number>;
  carritoVacio$!: Observable<boolean>;

  agregarProductoForm!: FormGroup;
  mostrarFormulario = false;
  cargando = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly productoService: ProductoService,
    private readonly calculatorService: PrecioCalculatorService,
    private readonly validator: ProductoValidator,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder
  ) {
    this.initializeObservables();
    this.initializeForm();
  }

  ngOnInit(): void { this.subscribeToProductChanges(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private initializeObservables(): void {
    this.productos$ = this.productoService.productos$;
    this.totales$ = this.productos$.pipe(map(p => this.calculatorService.calcularTotalesCarrito(p)));
    this.totalProductos$ = this.productos$.pipe(map(p => p.length));
    this.carritoVacio$ = this.productos$.pipe(map(p => p.length === 0));
  }

  private initializeForm(): void {
    this.agregarProductoForm = this.fb.group({
      nombreProducto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
    });
  }

  private subscribeToProductChanges(): void {
    this.productos$.pipe(takeUntil(this.destroy$)).subscribe(p => {
      if (p.length === 0) this.showMessage('info', 'Información', 'Carrito vacío');
    });
  }

  onAgregarProducto(): void {
    if (this.agregarProductoForm.invalid) { this.markFormGroupTouched(); return; }
    this.cargando = true;
    try {
      const v = this.agregarProductoForm.value;
      const dto: ProductoCreateDto = {
        nombreProducto: v.nombreProducto.trim(),
        precioUnitario: Number(v.precioUnitario),
        cantidad: Number(v.cantidad),
      };
      const producto = this.productoService.agregarProducto(dto);
      this.showMessage('success', 'Éxito', `${CARRITO_MESSAGES.PRODUCTO_AGREGADO}: "${producto.nombreProducto}"`);
      this.agregarProductoForm.reset({ cantidad: 1 });
      this.mostrarFormulario = false;
    } catch (e) { this.handleError(e); }
    finally { this.cargando = false; }
  }

  onIncrementarCantidad(cns: number) { try { this.productoService.incrementarCantidad(cns); this.showMessage('success','Éxito','Cantidad incrementada'); } catch (e) { this.handleError(e); } }
  onDecrementarCantidad(cns: number) { try { this.productoService.decrementarCantidad(cns); this.showMessage('success','Éxito','Cantidad decrementada'); } catch (e) { this.handleError(e); } }
  onEliminarProducto(cns: number, nombre: string) { try { this.productoService.eliminarProducto(cns); this.showMessage('success','Éxito',`${CARRITO_MESSAGES.PRODUCTO_ELIMINADO}: "${nombre}"`);} catch (e){ this.handleError(e);} }
  onLimpiarCarrito() { this.productoService.limpiarCarrito(); this.showMessage('info','Información',CARRITO_MESSAGES.CARRITO_LIMPIADO); }
  onToggleFormulario() { this.mostrarFormulario = !this.mostrarFormulario; if (!this.mostrarFormulario) this.agregarProductoForm.reset({ cantidad: 1 }); }
  onProcederPago() { this.showMessage('info', 'Información', 'Funcionalidad de pago en desarrollo'); }

  formatCurrency(n: number) { return this.calculatorService.formatCurrency(n); }

  private markFormGroupTouched() { Object.keys(this.agregarProductoForm.controls).forEach(k => this.agregarProductoForm.get(k)?.markAsTouched()); }
  private handleError(error: any) {
    const msg = error instanceof ProductoError ? error.message : CARRITO_MESSAGES.ERROR_GENERICO;
    this.showMessage('error', 'Error', msg); console.error('Error en carrito:', error);
  }
  private showMessage(severity: 'success'|'info'|'warn'|'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  get nombreProducto() { return this.agregarProductoForm.get('nombreProducto'); }
  get precioUnitario() { return this.agregarProductoForm.get('precioUnitario'); }
  get cantidad() { return this.agregarProductoForm.get('cantidad'); }
}
