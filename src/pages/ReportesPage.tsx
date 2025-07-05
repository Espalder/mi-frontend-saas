import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { getReporteGeneral, ReporteGeneral } from '../services/reportesService';
import { useTheme } from '@mui/material/styles';

const ReportesPage: React.FC = () => {
  const [reporte, setReporte] = useState<ReporteGeneral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    getReporteGeneral()
      .then(setReporte)
      .catch(() => setError('No se pudo cargar el reporte'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 600 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <AssessmentOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Reportes y Estadísticas</Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reporte ? (
          <Box>
            <Typography variant="h6" mb={2} color="text.primary">Ventas totales: {reporte.ventas_totales}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Productos más vendidos:</Typography>
            <List>
              {reporte.productos_mas_vendidos.map((prod, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={`${prod.nombre} (${prod.cantidad})`} />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Alert severity="info">No hay reportes disponibles.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ReportesPage; 