
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
import UserHeader from "./components/UserHeader";
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
import TrackingProvider from './components/TrackingProvider';
import ChatbotManager from './components/ChatbotManager';

const queryClient = new QueryClient()

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
            </Routes>
            <ChatbotManager />
            <Toaster />
          </BrowserRouter>
        </TrackingProvider>
      </SecureAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
