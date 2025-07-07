import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsuarios, Usuario, createUsuario, updateUsuario, deleteUsuario, UsuarioInput } from '../services/usuariosService';
import { useTheme } from '@mui/material/styles';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'inventario', label: 'Inventario' },
];

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

const initialForm = { username: '', nombre: '', email: '', rol: 'vendedor', password: '', activo: true };

type FormType = typeof initialForm;

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormType>(initialForm);
  const [formError, setFormError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const theme = useTheme();

  const fetchUsuarios = () => {
    setLoading(true);
    getUsuarios()
      .then(setUsuarios)
      .catch(() => setError('No se pudieron cargar los usuarios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenModal = (usuario?: Usuario) => {
    if (usuario) {
      setEditMode(true);
      setSelectedId(usuario.id);
      setForm({
        username: usuario.username,
        nombre: usuario.nombre,
        email: usuario.email || '',
        rol: usuario.rol,
        password: '',
        activo: usuario.activo,
      });
    } else {
      setEditMode(false);
      setSelectedId(null);
      setForm(initialForm);
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    if (!form.nombre.trim() || !form.username.trim() && !editMode) return 'Nombre y usuario requeridos';
    if (!editMode && !form.password.trim()) return 'Contraseña requerida';
    if (form.email && !validateEmail(form.email)) return 'Email inválido';
    return '';
  };

  const handleSubmit = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    try {
      if (editMode && selectedId) {
        const data: UsuarioInput = {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          activo: form.activo,
        };
        if (form.password) data.password = form.password;
        await updateUsuario(selectedId, data);
      } else {
        const data: UsuarioInput = {
          username: form.username,
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          password: form.password,
          activo: form.activo,
        };
        await createUsuario(data);
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (e: any) {
      setFormError(e?.response?.data?.detail || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUsuario(deleteId);
      setDeleteId(null);
      fetchUsuarios();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Error al eliminar');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Typography variant="h2" color="primary" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', background: '#fffbe6', borderRadius: 2, p: 2 }}>
        USUARIOS FUNCIONA
      </Typography>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 900 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <GroupOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Gestión de usuarios</Typography>
        </Box>
        <Typography variant="body1" mb={2} color="text.secondary">
          Aquí podrás ver, agregar, editar y eliminar usuarios de tu empresa.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenModal()}>Agregar usuario</Button>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : usuarios.length === 0 ? (
          <Alert severity="info">No hay usuarios registrados.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usr) => (
                  <TableRow key={usr.id}>
                    <TableCell>{usr.username}</TableCell>
                    <TableCell>{usr.nombre}</TableCell>
                    <TableCell>{usr.email}</TableCell>
                    <TableCell>{usr.rol}</TableCell>
                    <TableCell>{usr.activo ? 'Sí' : 'No'}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenModal(usr)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(usr.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* Modal Crear/Editar */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>{editMode ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            type="email"
          />
          <TextField
            margin="dense"
            label="Rol"
            name="rol"
            value={form.rol}
            onChange={handleChange}
            fullWidth
            select
          >
            {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </TextField>
          <TextField
            margin="dense"
            label="Contraseña"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            type="password"
            required={!editMode}
            helperText={editMode ? 'Dejar vacío para no cambiar' : ''}
          />
          <FormControlLabel
            control={<Checkbox checked={form.activo} onChange={handleChange} name="activo" />}
            label="Activo"
          />
          {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Guardar cambios' : 'Crear usuario'}</Button>
        </DialogActions>
      </Dialog>
      {/* Modal Confirmar Eliminación */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle>¿Eliminar usuario?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage; 