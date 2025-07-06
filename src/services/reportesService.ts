import api from './api';

export interface ReporteGeneral {
  total_productos: number;
  total_clientes: number;
  total_ventas: number;
  total_ventas_monto: number;
  ventas_mes: number;
  monto_mes: number;
}

export async function getReporteGeneral(): Promise<ReporteGeneral> {
  const res = await api.get<ReporteGeneral>('/api/reportes/general');
  return res.data;
}

export async function getVentasPorFechas(fechaInicio: string, fechaFin: string) {
  const res = await api.get(`/api/reportes/ventas-fechas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
  return res.data;
} 