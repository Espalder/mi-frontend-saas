import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { getClientes, Cliente } from '../services/clientesService';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(() => setError('No se pudieron cargar los clientes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor="#e6f3ff" p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: '#f9fafc', mb: 3, width: '100%', maxWidth: 900 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleAltOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5">Gestión de Clientes</Typography>
        </Box>
        <Typography variant="body1" mb={2}>
          Aquí podrás ver, agregar, editar y eliminar clientes de tu empresa.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>Agregar cliente</Button>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: '#fff' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cli) => (
                  <TableRow key={cli.id}>
                    <TableCell>{cli.id}</TableCell>
                    <TableCell>{cli.nombre}</TableCell>
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