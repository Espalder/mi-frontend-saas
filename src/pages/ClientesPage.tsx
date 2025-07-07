import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getClientes, Cliente, createCliente, updateCliente, deleteCliente } from '../services/clientesService';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [formError, setFormError] = useState('');
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(() => setError('No se pudieron cargar los clientes'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (cli?: Cliente) => {
    setOpen(true);
    setFormError('');
    if (cli) {
      setEditId(cli.id);
      setForm({ nombre: cli.nombre, email: cli.email || '', telefono: cli.telefono || '', direccion: cli.direccion || '' });
    } else {
      setEditId(null);
      setForm({ nombre: '', email: '', telefono: '', direccion: '' });
    }
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      if (!user) {
        setFormError('Usuario no autenticado');
        return;
      }
      const payload = {
        nombre: form.nombre,
        email: form.email || undefined,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined
      };
      if (editId) {
        await updateCliente(editId, payload);
      } else {
        await createCliente(payload);
      }
      setOpen(false);
      setLoading(true);
      getClientes()
        .then(setClientes)
        .catch(() => setError('No se pudieron cargar los clientes'))
        .finally(() => setLoading(false));
    } catch (err: any) {
      setFormError('Error al guardar cliente');
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar cliente?')) return;
    await deleteCliente(id);
    setLoading(true);
    getClientes()
      .then(setClientes)
      .catch(() => setError('No se pudieron cargar los clientes'))
      .finally(() => setLoading(false));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 600 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleAltOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Gestión de clientes</Typography>
        </Box>
        <Typography variant="body1" mb={2} color="text.secondary">
          Aquí podrás ver, agregar, editar y eliminar clientes de tu empresa.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpen()}>Añadir cliente</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Editar cliente' : 'Añadir cliente'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Nombre" name="nombre" fullWidth value={form.nombre} onChange={handleChange} />
            <TextField margin="dense" label="Email" name="email" fullWidth value={form.email} onChange={handleChange} />
            <TextField margin="dense" label="Teléfono" name="telefono" fullWidth value={form.telefono} onChange={handleChange} />
            <TextField margin="dense" label="Dirección" name="direccion" fullWidth value={form.direccion} onChange={handleChange} />
            {!user && <Alert severity="error">Usuario no autenticado</Alert>}
            {formError && user && <Alert severity="error">{formError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={!user}>Guardar</Button>
          </DialogActions>
        </Dialog>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : clientes.length === 0 ? (
          <Alert severity="info">No hay clientes registrados.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cli) => (
                  <TableRow key={cli.id}>
                    <TableCell>{cli.id}</TableCell>
                    <TableCell>{cli.nombre}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(cli)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(cli.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ClientesPage; 