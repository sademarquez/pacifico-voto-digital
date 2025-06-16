
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";

// Pages
import Dashboard from "@/pages/Dashboard";
import SimpleLogin from "@/pages/SimpleLogin";
import LoginTestPage from "@/pages/LoginTestPage";
import SystemAuditPage from "@/pages/SystemAuditPage";
import CompleteSystemAuditPage from "@/pages/CompleteSystemAuditPage";
import ConfiguracionAvanzada from "@/pages/ConfiguracionAvanzada";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/simple-login" element={<SimpleLogin />} />
              <Route path="/login-test" element={<LoginTestPage />} />
              <Route path="/system-audit" element={<SystemAuditPage />} />
              <Route path="/complete-audit" element={<CompleteSystemAuditPage />} />
              
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
              
              {/* Redirección por defecto */}
              <Route path="/" element={<Navigate to="/simple-login" replace />} />
              <Route path="*" element={<Navigate to="/simple-login" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
