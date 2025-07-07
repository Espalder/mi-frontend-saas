import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { getUsuarios, Usuario } from '../services/usuariosService';
import { useTheme } from '@mui/material/styles';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch(() => setError('No se pudieron cargar los usuarios'))
      .finally(() => setLoading(false));
  }, []);

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
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>Agregar usuario</Button>
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

export default UsuariosPage; 