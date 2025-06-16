
import {
  BrowserRouter,
  Routes,
  Route,
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
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
import TrackingProvider from './components/TrackingProvider';
import ChatbotManager from './components/ChatbotManager';
import GeminiAssistant from './components/GeminiAssistant';

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
      <SecureAuthProvider>
        <TrackingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/index" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mapa-alertas" element={<MapaAlertas />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/informes" element={<Informes />} />
              <Route path="/liderazgo" element={<Liderazgo />} />
              <Route path="/red-ayudantes" element={<RedAyudantes />} />
              <Route path="/tareas" element={<TasksPage />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/acciones-rapidas" element={<QuickActionsPage />} />
            </Routes>
            
            {/* Asistente IA Gemini disponible en toda la aplicación */}
            <GeminiAssistant />
            
            <ChatbotManager />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  color: '#333',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </BrowserRouter>
        </TrackingProvider>
      </SecureAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
