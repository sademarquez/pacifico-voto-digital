import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SimpleLogin from "./pages/SimpleLogin";
import LoginTestPage from "./pages/LoginTestPage";
import ConfiguracionAvanzada from "./pages/ConfiguracionAvanzada";
import RedAyudantes from "./pages/RedAyudantes";
import Mensajes from "./pages/Mensajes";
import ReportePublicidad from "./pages/ReportePublicidad";
import Registro from "./pages/Registro";
import UbicacionVotantes from "./pages/UbicacionVotantes";
import LugarVotacion from "./pages/LugarVotacion";
import AlertsPage from "./pages/AlertsPage";
import TerritoriesPage from "./pages/TerritoriesPage";
import EventsPage from "./pages/EventsPage";
import UsersPage from "./pages/UsersPage";
import InformesPage from "./pages/InformesPage";
import MobileAudit from "./pages/MobileAudit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SimpleAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/login-test" element={<LoginTestPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <SimpleProtectedRoute>
                <Dashboard />
              </SimpleProtectedRoute>
            } />
            
            <Route path="/configuracion-avanzada" element={
              <SimpleProtectedRoute>
                <ConfiguracionAvanzada />
              </SimpleProtectedRoute>
            } />
            
            <Route path="/red-ayudantes" element={
              <SimpleProtectedRoute>
                <RedAyudantes />
              </SimpleProtectedRoute>
            } />
            
            <Route path="/mensajes" element={
              <SimpleProtectedRoute>
                <Mensajes />
              </SimpleProtectedRoute>
            } />
            
            <Route path="/reporte-publicidad" element={
              <SimpleProtectedRoute>
                <ReportePublicidad />
              </SimpleProtectedRoute>
            } />
            
            <Route path="/registro" element={
              <SimpleProtectedRoute>
                <Registro />
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

            <Route path="/alerts" element={
              <SimpleProtectedRoute>
                <AlertsPage />
              </SimpleProtectedRoute>
            } />

            <Route path="/territories" element={
              <SimpleProtectedRoute>
                <TerritoriesPage />
              </SimpleProtectedRoute>
            } />

            <Route path="/events" element={
              <SimpleProtectedRoute>
                <EventsPage />
              </SimpleProtectedRoute>
            } />

            <Route path="/users" element={
              <SimpleProtectedRoute>
                <UsersPage />
              </SimpleProtectedRoute>
            } />

            <Route path="/informes" element={
              <SimpleProtectedRoute>
                <InformesPage />
              </SimpleProtectedRoute>
            } />

            <Route path="/mobile-audit" element={<MobileAudit />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SimpleAuthProvider>
  </QueryClientProvider>
);

export default App;
