import api from './api';

export interface Cliente {
  id: number;
  nombre: string;
  empresa_id: number;
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await api.get<Cliente[]>('clientes');
  return res.data;
}

export async function createCliente(data: Partial<Cliente>): Promise<Cliente> {
  const res = await api.post<Cliente>('clientes', data);
  return res.data;
}

export async function updateCliente(id: number, data: Partial<Cliente>): Promise<Cliente> {
  const res = await api.put<Cliente>(`clientes/${id}`, data);
  return res.data;
}

export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`clientes/${id}`);
} 