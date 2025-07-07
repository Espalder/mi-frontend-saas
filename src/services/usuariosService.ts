import api from './api';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
  empresa_id: number;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

// Nuevo tipo para crear/editar usuario, incluyendo password
export interface UsuarioInput extends Partial<Usuario> {
  password?: string;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await api.get<Usuario[]>('/api/usuarios');
  return res.data;
}

export async function createUsuario(data: UsuarioInput): Promise<Usuario> {
  const res = await api.post<Usuario>('/api/usuarios', data);
  return res.data;
}

export async function updateUsuario(id: number, data: UsuarioInput): Promise<Usuario> {
  const res = await api.put<Usuario>(`/api/usuarios/${id}`, data);
  return res.data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/api/usuarios/${id}`);
} 