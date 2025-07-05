import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setError('No se pudo cargar el usuario'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" justifyContent="center">
      <Typography variant="h4" mb={2}>Bienvenido al Dashboard del SaaS</Typography>
      <Typography variant="h6">Usuario: {user?.username}</Typography>
      <Typography variant="body1">Rol: {user?.rol}</Typography>
      <Typography variant="body2">Empresa ID: {user?.empresa_id}</Typography>
    </Box>
  );
};

export default DashboardPage; 