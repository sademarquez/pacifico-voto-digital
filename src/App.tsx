
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Registro from "./pages/Registro";
import MapaAlertas from "./pages/MapaAlertas";
import Liderazgo from "./pages/Liderazgo";
import ReportePublicidad from "./pages/ReportePublicidad";
import Estructura from "./pages/Estructura";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/mapa-alertas" element={<MapaAlertas />} />
            <Route path="/liderazgo" element={<Liderazgo />} />
            <Route path="/reporte-publicidad" element={<ReportePublicidad />} />
            <Route path="/estructura" element={<Estructura />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/informes" element={<Dashboard />} />
            <Route path="/lugar-votacion" element={<MapaAlertas />} />
            <Route path="/ubicacion-votantes" element={<MapaAlertas />} />
            <Route path="/mensajes" element={<Dashboard />} />
            <Route path="/configuracion" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
