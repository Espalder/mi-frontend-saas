import api from './api';

export interface Empresa {
  id: number;
  nombre: string;
  codigo_empresa: string;
  descripcion?: string;
  plan_suscripcion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string | null;
  activo?: boolean;
  direccion?: string;
  telefono?: string;
  email?: string;
  ruc?: string;
}

export async function getEmpresa(): Promise<Empresa> {
  const res = await api.get<Empresa>('/api/empresas/me');
  return res.data;
}

export async function updateEmpresa(data: Partial<Empresa>): Promise<Empresa> {
  const res = await api.put<Empresa>('/api/empresas/me', data);
  return res.data;
} 