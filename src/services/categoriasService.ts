import api from './api';

export interface Categoria {
  id: number;
  nombre: string;
}

export async function getCategorias(): Promise<Categoria[]> {
  const res = await api.get<Categoria[]>('/api/categorias/');
  return res.data;
} 