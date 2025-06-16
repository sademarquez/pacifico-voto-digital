
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Registro from "./pages/Registro";
import MapaAlertas from "./pages/MapaAlertas";
import Liderazgo from "./pages/Liderazgo";
import Estructura from "./pages/Estructura";
import ReportePublicidad from "./pages/ReportePublicidad";
import LugarVotacion from "./pages/LugarVotacion";
import UbicacionVotantes from "./pages/UbicacionVotantes";
import Dashboard from "./pages/Dashboard";
import Mensajes from "./pages/Mensajes";
import MensajesPrivados from "./pages/MensajesPrivados";
import Configuracion from "./pages/Configuracion";
import Informes from "./pages/Informes";
import Login from "./pages/Login";
import CandidatoFunnel from "./pages/CandidatoFunnel";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Navigation from "./components/Navigation";
import RedAyudantes from "./pages/RedAyudantes";
import ChatbotProvider from "./components/ChatbotProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para rutas públicas - permite acceso sin autenticación
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/candidato-funnel" element={
                <PublicRoute>
                  <CandidatoFunnel />
                </PublicRoute>
              } />
              <Route path="/mapa-alertas" element={
                <PublicRoute>
                  <MapaAlertas />
                </PublicRoute>
              } />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/registro" element={
                <ProtectedRoute>
                  <Registro />
                </ProtectedRoute>
              } />
              <Route path="/liderazgo" element={
                <ProtectedRoute>
                  <Liderazgo />
                </ProtectedRoute>
              } />
              <Route path="/estructura" element={
                <ProtectedRoute>
                  <Estructura />
                </ProtectedRoute>
              } />
              <Route path="/reporte-publicidad" element={
                <ProtectedRoute>
                  <ReportePublicidad />
                </ProtectedRoute>
              } />
              <Route path="/lugar-votacion" element={
                <ProtectedRoute>
                  <LugarVotacion />
                </ProtectedRoute>
              } />
              <Route path="/ubicacion-votantes" element={
                <ProtectedRoute>
                  <UbicacionVotantes />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/mensajes" element={
                <ProtectedRoute>
                  <Mensajes />
                </ProtectedRoute>
              } />
              <Route path="/mensajes-privados" element={
                <ProtectedRoute>
                  <MensajesPrivados />
                </ProtectedRoute>
              } />
              <Route path="/mensajes-privados/:id" element={
                <ProtectedRoute>
                  <MensajesPrivados />
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
              <Route path="/red-ayudantes" element={
                <ProtectedRoute>
                  <RedAyudantes />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotProvider />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
