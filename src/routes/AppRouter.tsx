import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductosPage from '../pages/ProductosPage';
import ClientesPage from '../pages/ClientesPage';
import VentasPage from '../pages/VentasPage';
import UsuariosPage from '../pages/UsuariosPage';
import EmpresaPage from '../pages/EmpresaPage';
import ReportesPage from '../pages/ReportesPage';
import { getToken } from '../services/authService';
import MainLayout from '../components/MainLayout';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: string;
  empresa_id: number;
}

const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('usuarios/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProductosPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute requiredRole="admin">
              <MainLayout>
                <ClientesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <PrivateRoute>
              <MainLayout>
                <VentasPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute requiredRole="admin">
              <MainLayout>
                <UsuariosPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/empresa"
          element={
            <PrivateRoute requiredRole="admin">
              <MainLayout>
                <EmpresaPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute requiredRole="admin">
              <MainLayout>
                <ReportesPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 