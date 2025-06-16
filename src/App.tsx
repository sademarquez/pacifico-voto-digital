
/*
 * MI CAMPAÑA 2025 - Sistema Electoral con IA
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 * 
 * Este software es propiedad exclusiva de sademarquezDLL.
 * Prohibida su reproducción, distribución o modificación sin autorización expresa.
 */

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MapaAlertas from "./pages/MapaAlertas";
import Registro from "./pages/Registro";
import Configuracion from "./pages/Configuracion";
import Informes from "./pages/Informes";
import Liderazgo from "./pages/Liderazgo";
import RedAyudantes from "./pages/RedAyudantes";
import TasksPage from "./pages/TasksPage";
import EventsPage from "./pages/EventsPage";
import QuickActionsPage from "./pages/QuickActionsPage";
import VisitorFunnelPage from "./pages/VisitorFunnelPage";
import MobileAuditPage from "./pages/MobileAuditPage";
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
import TrackingProvider from './components/TrackingProvider';
import ChatbotManager from './components/ChatbotManager';
import EnhancedMobileNavigation from './components/EnhancedMobileNavigation';
import ProtectedRoute from './components/ProtectedRoute';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import FloatingAccessibilityButton from './components/FloatingAccessibilityButton';
import './styles/modernTheme.css';
import './styles/accessibility.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (previously cacheTime)
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <SecureAuthProvider>
          <TrackingProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Navegación móvil moderna mejorada */}
                <EnhancedMobileNavigation />
                
                <Routes>
                  {/* Ruta raíz redirige directamente a login */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Páginas públicas - sin protección */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/index" element={<Index />} />
                  <Route path="/visitor-funnel" element={<VisitorFunnelPage />} />
                  <Route path="/mobile-audit" element={<MobileAuditPage />} />
                  
                  {/* Páginas protegidas - requieren autenticación */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/mapa-alertas" element={
                    <ProtectedRoute>
                      <MapaAlertas />
                    </ProtectedRoute>
                  } />
                  <Route path="/registro" element={
                    <ProtectedRoute>
                      <Registro />
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracion" element={
                    <ProtectedRoute>
                      <Configuracion />
                    </ProtectedRoute>
                  } />
                  <Route path="/informes" element={
                    <ProtectedRoute>
                      <Informes />
                    </ProtectedRoute>
                  } />
                  <Route path="/liderazgo" element={
                    <ProtectedRoute>
                      <Liderazgo />
                    </ProtectedRoute>
                  } />
                  <Route path="/red-ayudantes" element={
                    <ProtectedRoute>
                      <RedAyudantes />
                    </ProtectedRoute>
                  } />
                  <Route path="/tareas" element={
                    <ProtectedRoute>
                      <TasksPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/eventos" element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/acciones-rapidas" element={
                    <ProtectedRoute>
                      <QuickActionsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
                
                {/* Chatbot optimizado para ventas */}
                <ChatbotManager />
                
                {/* Botón flotante de accesibilidad */}
                <FloatingAccessibilityButton />
                
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#1f2937',
                      border: '1px solid rgba(229, 231, 235, 0.8)',
                      borderRadius: '1rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      backdropFilter: 'blur(20px)',
                    },
                  }}
                />
                
                {/* Copyright Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-black/5 backdrop-blur-sm border-t border-gray-200/50 py-2 px-4 text-center text-xs text-gray-500 z-10">
                  © 2025 sademarquezDLL - MI CAMPAÑA 2025. Todos los derechos reservados.
                </div>
              </div>
            </BrowserRouter>
          </TrackingProvider>
        </SecureAuthProvider>
      </AccessibilityProvider>
    </QueryClient>
  );
}

export default App;
