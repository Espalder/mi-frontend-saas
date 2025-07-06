import api from './api';

export interface Cliente {
  id: number;
  nombre: string;
  empresa_id: number;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await api.get<Cliente[]>('/api/clientes');
  return res.data;
}

export async function createCliente(data: Partial<Cliente>): Promise<Cliente> {
  const res = await api.post<Cliente>('/api/clientes', data);
  return res.data;
}

export async function updateCliente(id: number, data: Partial<Cliente>): Promise<Cliente> {
  const res = await api.put<Cliente>(`/api/clientes/${id}`, data);
  return res.data;
}

export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`/api/clientes/${id}`);
} 