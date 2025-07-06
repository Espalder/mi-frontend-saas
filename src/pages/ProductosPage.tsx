import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProductos, Producto, createProducto, updateProducto, deleteProducto } from '../services/productosService';
import { getCategorias } from '../services/categoriasService';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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
    precio_venta: '',
    stock: '',
    categoria_id: ''
  });
  const [formError, setFormError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [autoCodigo, setAutoCodigo] = useState(false);
  const theme = useTheme();

  const getNextCodigo = () => {
    if (productos.length === 0) return 'PROD-001';
    const codigos = productos.map(p => p.codigo).filter(c => /^PROD-\d+$/.test(c));
    const nums = codigos.map(c => parseInt(c.replace('PROD-', '')));
    const max = Math.max(...nums, 0);
    return `PROD-${(max + 1).toString().padStart(3, '0')}`;
  };

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

  const handleOpen = () => {
    setOpen(true);
    setFormError('');
    if (autoCodigo) {
      setForm(f => ({ ...f, codigo: getNextCodigo() }));
    }
  };
  const handleEdit = (producto: Producto) => {
    setForm({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      precio_compra: producto.precio_compra.toString(),
      precio_venta: producto.precio_venta.toString(),
      stock: producto.stock.toString(),
      categoria_id: producto.categoria_id ? producto.categoria_id.toString() : ''
    });
    setEditId(producto.id);
    setEditMode(true);
    setOpen(true);
    setFormError('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    setLoading(true);
    await deleteProducto(id);
    getProductos()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleAutoCodigo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoCodigo(e.target.checked);
    if (e.target.checked) {
      setForm(f => ({ ...f, codigo: getNextCodigo() }));
    }
  };
  const handleSubmit = async () => {
    if (!user) { setFormError('Usuario no autenticado'); return; }
    if (!form.precio_compra || isNaN(parseFloat(form.precio_compra))) {
      setFormError('El campo Precio compra es obligatorio y debe ser un número');
      return;
    }
    try {
      if (editMode && editId) {
        await updateProducto(editId, {
          codigo: form.codigo,
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          precio_compra: parseFloat(form.precio_compra),
          precio_venta: form.precio_venta ? parseFloat(form.precio_venta) : parseFloat(form.precio),
          stock: parseInt(form.stock),
          stock_minimo: 0,
          categoria_id: parseInt(form.categoria_id),
          empresa_id: user.empresa_id
        });
      } else {
        await createProducto({
          codigo: form.codigo,
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          precio_compra: parseFloat(form.precio_compra),
          precio_venta: form.precio_venta ? parseFloat(form.precio_venta) : parseFloat(form.precio),
          stock: parseInt(form.stock),
          stock_minimo: 0,
          categoria_id: parseInt(form.categoria_id),
          empresa_id: user.empresa_id
        });
      }
      setOpen(false);
      setEditMode(false);
      setEditId(null);
      setLoading(true);
      getProductos()
        .then(setProductos)
        .catch(() => setError('No se pudieron cargar los productos'))
        .finally(() => setLoading(false));
    } catch (err: any) {
      setFormError('Error al guardar producto');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
    setForm({
      codigo: '', nombre: '', descripcion: '', precio: '', precio_compra: '', precio_venta: '', stock: '', categoria_id: ''
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 900 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Inventory2OutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Gestión de inventario</Typography>
        </Box>
        <Typography variant="body1" mb={2} color="text.secondary">
          Aquí podrás ver, agregar, editar y eliminar productos de tu inventario.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Agregar producto</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? 'Editar producto' : 'Agregar producto'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Código" name="codigo" fullWidth value={form.codigo} onChange={handleChange} disabled={autoCodigo} />
            <FormControlLabel control={<Checkbox checked={autoCodigo} onChange={handleAutoCodigo} />} label="Autogenerar código" />
            <TextField margin="dense" label="Nombre" name="nombre" fullWidth value={form.nombre} onChange={handleChange} />
            <TextField margin="dense" label="Descripción" name="descripcion" fullWidth value={form.descripcion} onChange={handleChange} />
            <TextField margin="dense" label="Precio" name="precio" type="number" fullWidth value={form.precio} onChange={handleChange} />
            <TextField margin="dense" label="Precio compra" name="precio_compra" type="number" fullWidth value={form.precio_compra} onChange={handleChange} />
            <TextField margin="dense" label="Precio venta" name="precio_venta" type="number" fullWidth value={form.precio_venta} onChange={handleChange} />
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
                  <TableCell>Acciones</TableCell>
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
                    <TableCell>
                      <Button size="small" onClick={() => handleEdit(prod)}><EditIcon /></Button>
                      <Button size="small" color="error" onClick={() => handleDelete(prod.id)}><DeleteIcon /></Button>
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

export default ProductosPage; 