import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import { getVentas, Venta, createVenta, updateVenta, deleteVenta } from '../services/ventasService';
import { getClientes, Cliente } from '../services/clientesService';
import { getProductos, Producto } from '../services/productosService';
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({ subtotal: '', descuento: '', total: '', estado: '' });
  const [formError, setFormError] = useState('');

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState<number|null>(null);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [notas, setNotas] = useState('');
  const [user, setUser] = useState<any>(null);

  const handleOpen = (venta?: Venta) => {
    setOpen(true);
    setFormError('');
    if (venta) {
      setEditId(typeof venta.id === 'number' ? venta.id : null);
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
  const handleAddDetalle = () => {
    setDetalles([...detalles, { producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]);
  };
  const handleDetalleChange = (idx: number, field: string, value: any) => {
    const newDetalles = [...detalles];
    newDetalles[idx][field] = value;
    if (field === 'producto_id') {
      const prod = productos.find(p => p.id === parseInt(value));
      if (prod) {
        newDetalles[idx].precio_unitario = prod.precio;
        newDetalles[idx].subtotal = prod.precio * newDetalles[idx].cantidad;
      }
    }
    if (field === 'cantidad' || field === 'precio_unitario') {
      newDetalles[idx].subtotal = newDetalles[idx].cantidad * newDetalles[idx].precio_unitario;
    }
    setDetalles(newDetalles);
  };
  const handleRemoveDetalle = (idx: number) => {
    setDetalles(detalles.filter((_, i) => i !== idx));
  };
  const calcularTotales = () => {
    const subtotal = detalles.reduce((acc, d) => acc + (d.cantidad * d.precio_unitario), 0);
    const descuento = parseFloat(form.descuento) || 0;
    const total = subtotal - descuento;
    return { subtotal, descuento, total };
  };
  const handleSubmit = async () => {
    try {
      if (detalles.length === 0) {
        setFormError('Debes agregar al menos un producto');
        return;
      }
      const detallesLimpios = detalles.map(d => ({
        producto_id: Number(d.producto_id),
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        subtotal: Number(d.subtotal)
      }));
      if (detallesLimpios.some(d => !d.producto_id || !d.cantidad || !d.precio_unitario)) {
        setFormError('Todos los productos deben tener cantidad y precio');
        return;
      }
      const { subtotal, descuento, total } = calcularTotales();
      const data: any = {
        numero_factura: numeroFactura,
        subtotal,
        descuento,
        total,
        estado: form.estado,
        notas,
        detalles: detallesLimpios,
        empresa_id: (user && user.empresa_id) ? user.empresa_id : undefined
      };
      if (typeof clienteId === 'number') data.cliente_id = clienteId;
      if (editId) {
        await updateVenta(editId, data);
      } else {
        await createVenta({
          cliente_id: typeof clienteId === 'number' ? clienteId : undefined,
          usuario_id: user.id,
          numero_factura: numeroFactura,
          fecha: new Date().toISOString(),
          subtotal,
          descuento: parseFloat(form.descuento) || 0,
          total,
          estado: form.estado,
          notas,
          detalles: detalles.map(d => ({ producto_id: d.producto_id, cantidad: d.cantidad, precio_unitario: d.precio_unitario, subtotal: d.cantidad * d.precio_unitario }))
        });
      }
      setOpen(false);
      setLoading(true);
      getVentas()
        .then(setVentas)
        .catch(() => setError('No se pudieron cargar las ventas'))
        .finally(() => setLoading(false));
      setDetalles([]);
      setClienteId(null);
      setNumeroFactura('');
      setNotas('');
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

  const getNextFactura = () => {
    if (ventas.length === 0) return '000001';
    const nums = ventas.map(v => parseInt(v.numero_factura || '0')).filter(n => !isNaN(n));
    const max = Math.max(...nums, 0);
    return (max + 1).toString().padStart(6, '0');
  };

  useEffect(() => {
    getVentas()
      .then(setVentas)
      .catch(() => setError('No se pudieron cargar las ventas'))
      .finally(() => setLoading(false));
    getClientes().then(setClientes);
    getProductos().then(setProductos);
    api.get('usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!editId) {
      setNumeroFactura(getNextFactura());
    }
  }, [ventas, editId]);

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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{editId ? 'Editar venta' : 'Registrar venta'}</DialogTitle>
          <DialogContent>
            <TextField select label="Cliente" name="cliente_id" fullWidth value={clienteId ?? ''} onChange={e => setClienteId(e.target.value ? Number(e.target.value) : null)} SelectProps={{ native: true }} margin="dense">
              <option value="">Seleccionar cliente</option>
              {clientes.map(cli => <option key={cli.id} value={cli.id}>{cli.nombre}</option>)}
            </TextField>
            <TextField margin="dense" label="N° Factura" name="numero_factura" fullWidth value={numeroFactura} onChange={e => setNumeroFactura(e.target.value)} />
            <TextField margin="dense" label="Notas" name="notas" fullWidth value={notas} onChange={e => setNotas(e.target.value)} />
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1">Productos</Typography>
              {detalles.map((d, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField select label="Producto" name="producto_id" value={d.producto_id} onChange={e => handleDetalleChange(idx, 'producto_id', e.target.value)} SelectProps={{ native: true }} sx={{ minWidth: 150 }}>
                    <option value="">Seleccionar</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </TextField>
                  <TextField label="Cantidad" name="cantidad" type="number" value={d.cantidad} onChange={e => handleDetalleChange(idx, 'cantidad', e.target.value)} sx={{ width: 90 }} />
                  <TextField label="Precio unitario" name="precio_unitario" type="number" value={d.precio_unitario} onChange={e => handleDetalleChange(idx, 'precio_unitario', e.target.value)} sx={{ width: 120 }} />
                  <TextField label="Subtotal" name="subtotal" type="number" value={d.subtotal} InputProps={{ readOnly: true }} sx={{ width: 120 }} />
                  <Button color="error" onClick={() => handleRemoveDetalle(idx)}>Eliminar</Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={handleAddDetalle}>Agregar producto</Button>
            </Box>
            <TextField margin="dense" label="Descuento" name="descuento" type="number" fullWidth value={form.descuento} onChange={handleChange} />
            <TextField margin="dense" label="Estado" name="estado" fullWidth value={form.estado} onChange={handleChange} />
            <Box mt={2}>
              <Typography>Subtotal: {calcularTotales().subtotal}</Typography>
              <Typography>Descuento: {calcularTotales().descuento}</Typography>
              <Typography>Total: {calcularTotales().total}</Typography>
            </Box>
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
                      <IconButton onClick={() => handleDelete(typeof venta.id === 'number' ? venta.id : 0)}><DeleteIcon /></IconButton>
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