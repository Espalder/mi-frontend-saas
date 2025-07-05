import api from './api';

export interface Empresa {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ruc?: string;
}

export async function getEmpresaActual(): Promise<Empresa> {
  const res = await api.get<Empresa>('empresas/me');
  return res.data;
} 