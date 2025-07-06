import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { getProductos, Producto, createProducto } from '../services/productosService';
import { getCategorias } from '../services/categoriasService';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';

const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState<{id: number, nombre: string}[]>([]);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    precio_compra: '',
    stock: '',
    categoria_id: ''
  });
  const [formError, setFormError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos'));
    getCategorias()
      .then(setCategorias)
      .catch(() => setError('No se pudieron cargar las categorías'));
    // Obtener usuario autenticado
    api.get('usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = () => { setOpen(true); setFormError(''); };
  const handleClose = () => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    if (!user) { setFormError('Usuario no autenticado'); return; }
    try {
      await createProducto({
        codigo: form.codigo,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        precio_compra: parseFloat(form.precio_compra),
        stock: parseInt(form.stock),
        stock_minimo: 0,
        categoria_id: parseInt(form.categoria_id),
        empresa_id: user.empresa_id
      });
      setOpen(false);
      setLoading(true);
      getProductos()
        .then(setProductos)
        .catch(() => setError('No se pudieron cargar los productos'))
        .finally(() => setLoading(false));
    } catch (err: any) {
      setFormError('Error al crear producto');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 900 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Inventory2OutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Gestión de productos</Typography>
        </Box>
        <Typography variant="body1" mb={2} color="text.secondary">
          Aquí podrás ver, agregar, editar y eliminar productos de tu empresa.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Agregar producto</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Agregar producto</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Código" name="codigo" fullWidth value={form.codigo} onChange={handleChange} />
            <TextField margin="dense" label="Nombre" name="nombre" fullWidth value={form.nombre} onChange={handleChange} />
            <TextField margin="dense" label="Descripción" name="descripcion" fullWidth value={form.descripcion} onChange={handleChange} />
            <TextField margin="dense" label="Precio" name="precio" type="number" fullWidth value={form.precio} onChange={handleChange} />
            <TextField margin="dense" label="Precio compra" name="precio_compra" type="number" fullWidth value={form.precio_compra} onChange={handleChange} />
            <TextField margin="dense" label="Stock" name="stock" type="number" fullWidth value={form.stock} onChange={handleChange} />
            <TextField margin="dense" label="Categoría" name="categoria_id" select fullWidth value={form.categoria_id} onChange={handleChange} SelectProps={{ native: true }}>
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </TextField>
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
        ) : productos.length === 0 ? (
          <Alert severity="info">No hay productos registrados.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Categoría</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell>{prod.codigo}</TableCell>
                    <TableCell>{prod.nombre}</TableCell>
                    <TableCell>{prod.descripcion}</TableCell>
                    <TableCell>{prod.precio}</TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>{prod.categoria_nombre}</TableCell>
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

export default ProductosPage; 