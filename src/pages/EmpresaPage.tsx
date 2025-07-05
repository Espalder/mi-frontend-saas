import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { getEmpresaActual, Empresa } from '../services/empresaService';

const EmpresaPage: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmpresaActual()
      .then(setEmpresa)
      .catch(() => setError('No se pudo cargar la información de la empresa'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor="#e6f3ff" p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: '#f9fafc', mb: 3, width: '100%', maxWidth: 600 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <BusinessOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5">Configuración de Empresa</Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : empresa ? (
          <Box>
            <Typography variant="h6">{empresa.nombre}</Typography>
            {empresa.ruc && <Typography variant="body1">RUC: {empresa.ruc}</Typography>}
            {empresa.direccion && <Typography variant="body1">Dirección: {empresa.direccion}</Typography>}
            {empresa.telefono && <Typography variant="body1">Teléfono: {empresa.telefono}</Typography>}
            {empresa.email && <Typography variant="body1">Email: {empresa.email}</Typography>}
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
};

export default EmpresaPage; 