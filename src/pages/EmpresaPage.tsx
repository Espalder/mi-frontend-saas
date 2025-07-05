import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { getEmpresa, Empresa } from '../services/empresaService';
import { useTheme } from '@mui/material/styles';

const EmpresaPage: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    getEmpresa()
      .then(setEmpresa)
      .catch(() => setError('No se pudo cargar la información de la empresa'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 600 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <BusinessOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Configuración de Empresa</Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : empresa ? (
          <Box>
            <Typography variant="h6" color="text.primary">{empresa.nombre}</Typography>
            {empresa.ruc && <Typography variant="body1" color="text.secondary">RUC: {empresa.ruc}</Typography>}
            {empresa.direccion && <Typography variant="body1" color="text.secondary">Dirección: {empresa.direccion}</Typography>}
            {empresa.telefono && <Typography variant="body1" color="text.secondary">Teléfono: {empresa.telefono}</Typography>}
            {empresa.email && <Typography variant="body1" color="text.secondary">Email: {empresa.email}</Typography>}
          </Box>
        ) : (
          <Alert severity="info">No hay información de la empresa registrada.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default EmpresaPage; 