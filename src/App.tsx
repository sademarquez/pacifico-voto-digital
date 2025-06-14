
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
import Configuracion from "./pages/Configuracion";
import Informes from "./pages/Informes";
import Login from "./pages/Login";
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
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
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
              <Route path="/mapa-alertas" element={
                <ProtectedRoute>
                  <MapaAlertas />
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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
