import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, useTheme, ThemeProvider, createTheme, Avatar, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

const drawerWidth = 220;

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

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
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

  const drawer = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Avatar src={process.env.PUBLIC_URL + '/logo_empresa.png'} alt="Logo Empresa" sx={{ width: 64, height: 64, mb: 2, bgcolor: theme.palette.background.paper, boxShadow: 2 }} />
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: theme.palette.text.primary }}>Mi Empresa</Typography>
        {user && (
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
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
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' }, zIndex: 1 }}>
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
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: theme.palette.background.default, background: !darkMode ? 'linear-gradient(135deg, #e6f3ff 0%, #f4f6fa 100%)' : undefined }}>
        <Toolbar />
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout; 