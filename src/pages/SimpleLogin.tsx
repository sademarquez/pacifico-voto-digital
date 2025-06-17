
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";
import PageLayout from "@/components/PageLayout";
import LoginForm from "@/components/LoginForm";

const SimpleLogin = () => {
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Log para debugging
  useEffect(() => {
    console.log('🔄 SimpleLogin - Estado actual:', {
      isAuthenticated,
      isLoading,
      authError,
      pathname: location.pathname,
      hasRedirected
    });
  }, [isAuthenticated, isLoading, authError, location.pathname, hasRedirected]);

  // Redirigir si ya está autenticado (solo una vez)
  useEffect(() => {
    if (isAuthenticated && !isLoading && !hasRedirected) {
      console.log('✅ Usuario autenticado, redirigiendo...');
      setHasRedirected(true);
      const from = location.state?.from?.pathname || '/dashboard';
      
      // Usar setTimeout para evitar problemas de re-render
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, location.state, hasRedirected]);

  // Si ya está autenticado y redirigiendo, mostrar loading
  if (isAuthenticated && !hasRedirected) {
    return (
      <PageLayout borderVariant="gradient" borderColor="green">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-green-600">¡Autenticado!</h2>
            <p className="text-gray-600">Redirigiendo al dashboard...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Si ya redirigió, no mostrar nada
  if (hasRedirected) {
    return null;
  }

  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="blue"
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
    >
      <div className="relative overflow-hidden">
        <SystemHealthIndicator />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <LoginForm
            onLogin={login}
            isLoading={isLoading}
            authError={authError}
            clearAuthError={clearAuthError}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default SimpleLogin;
