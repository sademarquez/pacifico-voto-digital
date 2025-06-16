
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";

// Páginas principales
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SimpleLogin from "./pages/SimpleLogin";
import LoginTestPage from "./pages/LoginTestPage";
import SimpleProtectedRoute from "./components/SimpleProtectedRoute";
import Estructura from "./pages/Estructura";
import Mensajes from "./pages/Mensajes";
import MensajesPrivados from "./pages/MensajesPrivados";
import Informes from "./pages/Informes";
import MapaAlertas from "./pages/MapaAlertas";
import UbicacionVotantes from "./pages/UbicacionVotantes";
import LugarVotacion from "./pages/LugarVotacion";
import Registro from "./pages/Registro";
import RegistroPersonalizado from "./pages/RegistroPersonalizado";
import Liderazgo from "./pages/Liderazgo";
import RedAyudantes from "./pages/RedAyudantes";
import ReportePublicidad from "./pages/ReportePublicidad";
import Configuracion from "./pages/Configuracion";
import CandidatoFunnel from "./pages/CandidatoFunnel";
import VisitorFunnelPage from "./pages/VisitorFunnelPage";
import ManualesDemo from "./pages/ManualesDemo";
import MobileAuditPage from "./pages/MobileAuditPage";
import EventsPage from "./pages/EventsPage";
import TasksPage from "./pages/TasksPage";
import QuickActionsPage from "./pages/QuickActionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/simple-login" element={<SimpleLogin />} />
              <Route path="/login-test" element={<LoginTestPage />} />
              <Route path="/mobile-audit" element={<MobileAuditPage />} />
              
              {/* Redirect de login antiguo */}
              <Route path="/login" element={<Navigate to="/simple-login" replace />} />
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={
                <SimpleProtectedRoute>
                  <Dashboard />
                </SimpleProtectedRoute>
              } />
              <Route path="/estructura" element={
                <SimpleProtectedRoute>
                  <Estructura />
                </SimpleProtectedRoute>
              } />
              <Route path="/mensajes" element={
                <SimpleProtectedRoute>
                  <Mensajes />
                </SimpleProtectedRoute>
              } />
              <Route path="/mensajes-privados" element={
                <SimpleProtectedRoute>
                  <MensajesPrivados />
                </SimpleProtectedRoute>
              } />
              <Route path="/informes" element={
                <SimpleProtectedRoute>
                  <Informes />
                </SimpleProtectedRoute>
              } />
              <Route path="/mapa-alertas" element={
                <SimpleProtectedRoute>
                  <MapaAlertas />
                </SimpleProtectedRoute>
              } />
              <Route path="/ubicacion-votantes" element={
                <SimpleProtectedRoute>
                  <UbicacionVotantes />
                </SimpleProtectedRoute>
              } />
              <Route path="/lugar-votacion" element={
                <SimpleProtectedRoute>
                  <LugarVotacion />
                </SimpleProtectedRoute>
              } />
              <Route path="/registro" element={
                <SimpleProtectedRoute>
                  <Registro />
                </SimpleProtectedRoute>
              } />
              <Route path="/registro-personalizado" element={
                <SimpleProtectedRoute>
                  <RegistroPersonalizado />
                </SimpleProtectedRoute>
              } />
              <Route path="/liderazgo" element={
                <SimpleProtectedRoute>
                  <Liderazgo />
                </SimpleProtectedRoute>
              } />
              <Route path="/red-ayudantes" element={
                <SimpleProtectedRoute>
                  <RedAyudantes />
                </SimpleProtectedRoute>
              } />
              <Route path="/reporte-publicidad" element={
                <SimpleProtectedRoute>
                  <ReportePublicidad />
                </SimpleProtectedRoute>
              } />
              <Route path="/configuracion" element={
                <SimpleProtectedRoute>
                  <Configuracion />
                </SimpleProtectedRoute>
              } />
              <Route path="/candidato-funnel" element={
                <SimpleProtectedRoute>
                  <CandidatoFunnel />
                </SimpleProtectedRoute>
              } />
              <Route path="/visitor-funnel" element={
                <SimpleProtectedRoute>
                  <VisitorFunnelPage />
                </SimpleProtectedRoute>
              } />
              <Route path="/manuales-demo" element={
                <SimpleProtectedRoute>
                  <ManualesDemo />
                </SimpleProtectedRoute>
              } />
              <Route path="/events" element={
                <SimpleProtectedRoute>
                  <EventsPage />
                </SimpleProtectedRoute>
              } />
              <Route path="/tasks" element={
                <SimpleProtectedRoute>
                  <TasksPage />
                </SimpleProtectedRoute>
              } />
              <Route path="/quick-actions" element={
                <SimpleProtectedRoute>
                  <QuickActionsPage />
                </SimpleProtectedRoute>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SimpleAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
