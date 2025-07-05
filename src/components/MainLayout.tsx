import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, useTheme, ThemeProvider, createTheme, Avatar } from '@mui/material';
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
import logo from '../assets/logo_empresa.png';

const drawerWidth = 220;

const menuItems = [
  { text: 'Dashboard', icon: <BusinessOutlinedIcon />, path: '/dashboard' },
  { text: 'Productos', icon: <Inventory2OutlinedIcon />, path: '/productos' },
  { text: 'Clientes', icon: <PeopleAltOutlinedIcon />, path: '/clientes' },
  { text: 'Ventas', icon: <PointOfSaleOutlinedIcon />, path: '/ventas' },
  { text: 'Usuarios', icon: <GroupOutlinedIcon />, path: '/usuarios' },
  { text: 'Empresa', icon: <BusinessOutlinedIcon />, path: '/empresa' },
  { text: 'Reportes', icon: <AssessmentOutlinedIcon />, path: '/reportes' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: {
        default: darkMode ? '#23272f' : '#e6f3ff',
        paper: darkMode ? '#2c313a' : '#f9fafc',
      },
    },
  });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <Avatar src={logo} alt="Logo" sx={{ width: 64, height: 64, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">Mi Empresa</Typography>
      </Box>
      <List>
        {menuItems.map(item => (
          <ListItem button key={item.text} selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout} sx={{ mt: 2 }}>
          <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} color="primary">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Sistema de Gestión Empresarial
            </Typography>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="default" />
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: theme.palette.background.default }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout; 