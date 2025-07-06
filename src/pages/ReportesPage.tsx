import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Button } from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { getReporteGeneral, ReporteGeneral } from '../services/reportesService';
import { useTheme } from '@mui/material/styles';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getVentas, Venta } from '../services/ventasService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

const ReportesPage: React.FC = () => {
  const [reporte, setReporte] = useState<ReporteGeneral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(dayjs().endOf('day'));
  const [rango, setRango] = useState('dia');
  const theme = useTheme();

  useEffect(() => {
    getReporteGeneral()
      .then(setReporte)
      .catch(() => setError('No se pudo cargar el reporte'))
      .finally(() => setLoading(false));
    getVentas().then(setVentas);
  }, []);

  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte General', 10, 10);
    // @ts-ignore
    doc.autoTable({
      head: [['ID', 'Fecha', 'Subtotal', 'Descuento', 'Total', 'Estado']],
      body: ventas.map(v => [v.id, v.fecha, v.subtotal, v.descuento, v.total, v.estado])
    });
    doc.save('reporte_ventas.pdf');
  };

  const handleRangoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRango(value);
    if (value === 'dia') {
      setFechaInicio(dayjs().startOf('day'));
      setFechaFin(dayjs().endOf('day'));
    } else if (value === 'semana') {
      setFechaInicio(dayjs().startOf('week'));
      setFechaFin(dayjs().endOf('week'));
    } else if (value === 'mes') {
      setFechaInicio(dayjs().startOf('month'));
      setFechaFin(dayjs().endOf('month'));
    } else if (value === 'año') {
      setFechaInicio(dayjs().startOf('year'));
      setFechaFin(dayjs().endOf('year'));
    }
  };

  // Lógica para filtrar y mostrar reportes según fechaInicio y fechaFin

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" bgcolor={theme => theme.palette.background.default} p={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, bgcolor: 'background.paper', mb: 3, width: '100%', maxWidth: 600 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <AssessmentOutlinedIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5" color="text.primary">Reportes y Estadísticas</Typography>
        </Box>
        <Box mb={2}>
          <select value={rango} onChange={handleRangoChange}>
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="año">Año</option>
            <option value="personalizado">Personalizado</option>
          </select>
          {rango === 'personalizado' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Desde" value={fechaInicio} onChange={setFechaInicio} />
              <DatePicker label="Hasta" value={fechaFin} onChange={setFechaFin} />
            </LocalizationProvider>
          )}
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reporte ? (
          <Box>
            <Typography variant="h6" mb={2} color="text.primary">Ventas totales: {reporte.total_ventas ?? 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Total productos: {reporte.total_productos ?? 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Total clientes: {reporte.total_clientes ?? 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Monto total ventas: ${reporte.total_ventas_monto ?? 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Ventas este mes: {reporte.ventas_mes ?? 0}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Monto ventas este mes: ${reporte.monto_mes ?? 0}</Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleDescargarPDF}>Descargar informe PDF</Button>
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mt: 2 }}>
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
          </Box>
        ) : (
          <Alert severity="info">No hay reportes disponibles.</Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ReportesPage; 