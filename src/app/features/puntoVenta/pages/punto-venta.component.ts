import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../services/producto.service';
import { IItemVenta } from '../models/vental.model';

@Component({
  selector: 'app-punto-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ProductoService],
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.css']
})
export class PuntoVentaComponent implements OnInit {
  
  formularioProducto: FormGroup;
  productos: IItemVenta[] = [];
  totales = { subtotal: 0, iva: 0, total: 0 };
  editandoProducto: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.formularioProducto = this.fb.group({
      nombreProducto: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.actualizarLista();
  }

  registrarProducto(): void {
    if (this.formularioProducto.valid) {
      const { nombreProducto, cantidad, precioUnitario } = this.formularioProducto.value;
      
      if (this.editandoProducto) {
        this.productoService.modificarProducto(this.editandoProducto, cantidad);
        this.editandoProducto = null;
      } else {
        this.productoService.agregarProducto(nombreProducto, precioUnitario, cantidad);
      }
      
      this.formularioProducto.reset();
      this.formularioProducto.patchValue({ cantidad: 1, precioUnitario: 0 });
      this.actualizarLista();
    }
  }

  editarProducto(cns: number): void {
    const producto = this.productoService.buscarProducto(cns);
    if (producto) {
      this.formularioProducto.patchValue({
        nombreProducto: producto.nombreProducto,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario
      });
      this.editandoProducto = cns;
    }
  }

  eliminarProducto(cns: number): void {
    this.productoService.eliminarProducto(cns);
    this.actualizarLista();
  }

  cancelarEdicion(): void {
    this.editandoProducto = null;
    this.formularioProducto.reset();
    this.formularioProducto.patchValue({ cantidad: 1, precioUnitario: 0 });
  }

  private actualizarLista(): void {
    this.productos = this.productoService.listaProductos;
    this.totales = this.productoService.calcularTotales();
  }
}