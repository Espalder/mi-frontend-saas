import api from './api';

export interface ReporteGeneral {
  ventas_totales: number;
  productos_mas_vendidos: { nombre: string; cantidad: number }[];
}

export async function getReporteGeneral(): Promise<ReporteGeneral> {
  const res = await api.get<ReporteGeneral>('/api/reportes/general');
  return res.data;
} 