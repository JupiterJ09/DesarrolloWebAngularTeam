import { integer } from '../../../../../node_modules/zod/src/v4/core/regexes';
export interface IItemVenta{
    cns: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
    precioTotal: number;
}

