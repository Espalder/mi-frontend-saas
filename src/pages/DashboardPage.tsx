import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setError('No se pudo cargar el usuario'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" justifyContent="center" bgcolor={theme => theme.palette.background.default}>
      <Typography variant="h4" mb={2} color="text.primary">Bienvenido al Dashboard del SaaS</Typography>
      {user ? (
        <>
          <Typography variant="h6" color="text.primary">Usuario: {user?.username}</Typography>
          <Typography variant="body1" color="text.primary">Rol: {user?.rol}</Typography>
          <Typography variant="body2" color="text.secondary">Empresa ID: {user?.empresa_id}</Typography>
        </>
      ) : (
        <Typography variant="body1" color="error">No se pudo cargar el usuario</Typography>
      )}
    </Box>
  );
};

export default DashboardPage; 