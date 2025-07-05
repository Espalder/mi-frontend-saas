import api from './api';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  categoria_id?: number;
  categoria_nombre?: string;
  empresa_id: number;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  activo: boolean;
}

export async function getProductos(): Promise<Producto[]> {
  const res = await api.get<Producto[]>('productos');
  return res.data;
}

export async function createProducto(data: Partial<Producto>): Promise<Producto> {
  const res = await api.post<Producto>('productos', data);
  return res.data;
}

export async function updateProducto(id: number, data: Partial<Producto>): Promise<Producto> {
  const res = await api.put<Producto>(`productos/${id}`, data);
  return res.data;
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`productos/${id}`);
} 