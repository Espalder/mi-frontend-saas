import api from './api';

export interface Venta {
  id: number;
  fecha: string;
  cliente_id?: number;
  usuario_id?: number;
  subtotal: number;
  descuento: number;
  total: number;
  estado: string;
  empresa_id?: number;
}

export async function getVentas(): Promise<Venta[]> {
  const res = await api.get<Venta[]>('ventas');
  return res.data;
}

export async function createVenta(data: Partial<Venta>): Promise<Venta> {
  const res = await api.post<Venta>('ventas', data);
  return res.data;
}

export async function updateVenta(id: number, data: Partial<Venta>): Promise<Venta> {
  const res = await api.put<Venta>(`ventas/${id}`, data);
  return res.data;
}

export async function deleteVenta(id: number): Promise<void> {
  await api.delete(`ventas/${id}`);
} 