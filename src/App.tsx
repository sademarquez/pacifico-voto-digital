
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SimpleAuthProvider>
  </QueryClientProvider>
);

export default App;
