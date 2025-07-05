import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import { getVentas, Venta, createVenta, updateVenta, deleteVenta } from '../services/ventasService';
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({ subtotal: '', descuento: '', total: '', estado: '' });
  const [formError, setFormError] = useState('');

  const handleOpen = (venta?: Venta) => {
    setOpen(true);
    setFormError('');
    if (venta) {
      setEditId(venta.id);
      setForm({ subtotal: venta.subtotal.toString(), descuento: venta.descuento.toString(), total: venta.total.toString(), estado: venta.estado });
    } else {
      setEditId(null);
      setForm({ subtotal: '', descuento: '', total: '', estado: '' });
    }
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const data = {
        subtotal: parseFloat(form.subtotal),
        descuento: parseFloat(form.descuento),
        total: parseFloat(form.total),
        estado: form.estado
      };
      if (editId) {
        await updateVenta(editId, data);
      } else {
        await createVenta(data);
      }
      setOpen(false);
      setLoading(true);
      getVentas()
        .then(setVentas)
        .catch(() => setError('No se pudieron cargar las ventas'))
        .finally(() => setLoading(false));
    } catch (err: any) {
      setFormError('Error al guardar venta');
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar venta?')) return;
    await deleteVenta(id);
    setLoading(true);
    getVentas()
      .then(setVentas)
      .catch(() => setError('No se pudieron cargar las ventas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getVentas()
      .then(setVentas)
      .catch(() => setError('No se pudieron cargar las ventas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 900 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <PointOfSaleOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Gestión de Ventas</Typography>
        </Box>
        <Typography variant="body1" mb={2} color="text.secondary">
          Aquí podrás ver, registrar y gestionar las ventas de tu empresa.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpen()}>Registrar venta</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Editar venta' : 'Registrar venta'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Subtotal" name="subtotal" type="number" fullWidth value={form.subtotal} onChange={handleChange} />
            <TextField margin="dense" label="Descuento" name="descuento" type="number" fullWidth value={form.descuento} onChange={handleChange} />
            <TextField margin="dense" label="Total" name="total" type="number" fullWidth value={form.total} onChange={handleChange} />
            <TextField margin="dense" label="Estado" name="estado" fullWidth value={form.estado} onChange={handleChange} />
            {formError && <Alert severity="error">{formError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : ventas.length === 0 ? (
          <Alert severity="info">No hay ventas registradas.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>Descuento</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>{venta.fecha}</TableCell>
                    <TableCell>{venta.subtotal}</TableCell>
                    <TableCell>{venta.descuento}</TableCell>
                    <TableCell>{venta.total}</TableCell>
                    <TableCell>{venta.estado}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(venta)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(venta.id)}><DeleteIcon /></IconButton>
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

export default VentasPage; 