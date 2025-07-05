import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import { getVentas, Venta } from '../services/ventasService';
import { useTheme } from '@mui/material/styles';

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

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
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>Registrar venta</Button>
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