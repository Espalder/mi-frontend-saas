import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, useTheme, ThemeProvider, createTheme, Avatar, ListItemButton, Modal, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../services/authService';
import api from '../services/api';

const drawerWidth = 260;

interface User {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
  empresa_id: number;
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true); // Controla el Drawer en desktop

  useEffect(() => {
    api.get('usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: {
        default: darkMode ? '#23272f' : 'linear-gradient(135deg, #e6f3ff 0%, #f4f6fa 100%)',
        paper: darkMode ? '#2c313a' : '#f9fafc',
      },
      text: {
        primary: darkMode ? '#fff' : '#222e3a',
        secondary: darkMode ? '#b0b8c1' : '#4b5563',
      },
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setDrawerOpen(!drawerOpen);
  };
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Filtrar menús según el rol del usuario
  const getMenuItems = () => {
    const allMenuItems = [
      { text: 'Dashboard', icon: <BusinessOutlinedIcon />, path: '/dashboard' },
      { text: 'Inventario', icon: <Inventory2OutlinedIcon />, path: '/productos' },
      { text: 'Clientes', icon: <PeopleAltOutlinedIcon />, path: '/clientes', adminOnly: true },
      { text: 'Ventas', icon: <PointOfSaleOutlinedIcon />, path: '/ventas', adminOnly: true },
      { text: 'Usuarios', icon: <GroupOutlinedIcon />, path: '/usuarios', adminOnly: true },
      { text: 'Empresa', icon: <BusinessOutlinedIcon />, path: '/empresa', adminOnly: true },
      { text: 'Reportes', icon: <AssessmentOutlinedIcon />, path: '/reportes', adminOnly: true },
    ];

    if (!user) return allMenuItems;

    // Si es inventario, solo mostrar dashboard y productos
    if (user.rol === 'inventario') {
      return allMenuItems.filter(item => !item.adminOnly);
    }

    // Si es vendedor, mostrar dashboard, productos y ventas
    if (user.rol === 'vendedor') {
      return allMenuItems.filter(item => !item.adminOnly || item.text === 'Ventas');
    }

    // Si es admin, mostrar todo
    return allMenuItems;
  };

  const menuItems = getMenuItems();

  // Modal para editar logo (solo frontend, sin lógica backend)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const logoSrc = logoPreview || process.env.PUBLIC_URL + '/Logo-Project.png';

  const drawer = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Box position="relative" mb={1} display="flex" justifyContent="center" alignItems="center" width="100%">
          <Avatar
            src={logoSrc}
            alt="Logo Empresa"
            sx={{ width: 120, height: 120, mb: 1, bgcolor: theme.palette.background.paper, boxShadow: 2, cursor: 'pointer', border: '4px solid #fff' }}
            onClick={() => setLogoModalOpen(true)}
          />
          <IconButton size="small" sx={{ position: 'absolute', bottom: 16, right: 32, bgcolor: '#fff', boxShadow: 1 }} onClick={() => setLogoModalOpen(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: theme.palette.text.primary, textAlign: 'center' }}>Mi Empresa</Typography>
        {user && (
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
            {user.nombre} ({user.rol})
          </Typography>
        )}
      </Box>
      <List>
        {menuItems.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ mt: 2 }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} color="primary">
        <Toolbar sx={{ position: 'relative', minHeight: 80 }}>
          {/* Banner decorativo en la cabecera */}
          {!darkMode && (
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'url("/banner_bg.png") center/cover no-repeat',
              opacity: 0.12,
              zIndex: 0,
            }} />
          )}
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, zIndex: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, zIndex: 1 }}>
            Sistema de Gestión Empresarial
          </Typography>
          <Switch checked={darkMode} onChange={() => {
            setDarkMode((prev: boolean) => {
              localStorage.setItem('darkMode', JSON.stringify(!prev));
              return !prev;
            });
          }} color="default" />
        </Toolbar>
      </AppBar>
      {/* Drawer permanente en desktop, ocultable */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: drawerOpen ? 'block' : 'none',
            transition: 'width 0.3s',
          },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {drawer}
      </Drawer>
      {/* Drawer temporal en mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        width: '100%',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        background: !darkMode ? 'linear-gradient(135deg, #e6f3ff 0%, #f4f6fa 100%)' : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transition: 'width 0.3s',
        overflowY: 'auto',
      }}>
        <Toolbar />
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
      {/* Modal para editar logo */}
      <Modal open={logoModalOpen} onClose={() => setLogoModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 320 }}>
          <Typography variant="h6" mb={2}>Editar logotipo de la empresa</Typography>
          <Avatar src={logoPreview || process.env.PUBLIC_URL + '/Logo-Project.png'} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
          <Button variant="contained" component="label" fullWidth>
            Subir nueva imagen
            <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
          </Button>
          <Button onClick={() => setLogoModalOpen(false)} sx={{ mt: 2 }} fullWidth>Cerrar</Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default MainLayout; 