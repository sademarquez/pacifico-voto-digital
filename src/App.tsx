import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Navigation from "./components/Navigation";
import RedAyudantes from "./pages/RedAyudantes";

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/mapa-alertas" element={<MapaAlertas />} />
            <Route path="/liderazgo" element={<Liderazgo />} />
            <Route path="/estructura" element={<Estructura />} />
            <Route path="/reporte-publicidad" element={<ReportePublicidad />} />
            <Route path="/lugar-votacion" element={<LugarVotacion />} />
            <Route path="/ubicacion-votantes" element={<UbicacionVotantes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/informes" element={<Informes />} />
            <Route path="/red-ayudantes" element={<RedAyudantes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
