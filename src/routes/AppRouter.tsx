import React from 'react';
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
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
            <PrivateRoute>
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
            <PrivateRoute>
              <MainLayout>
                <UsuariosPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/empresa"
          element={
            <PrivateRoute>
              <MainLayout>
                <EmpresaPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
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