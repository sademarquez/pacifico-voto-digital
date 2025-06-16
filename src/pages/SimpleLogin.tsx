
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";
import PageLayout from "@/components/PageLayout";
import LoginForm from "@/components/LoginForm";

const SimpleLogin = () => {
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Log para debugging
  useEffect(() => {
    console.log('🔄 SimpleLogin - Estado actual:', {
      isAuthenticated,
      isLoading,
      authError,
      pathname: location.pathname
    });
  }, [isAuthenticated, isLoading, authError, location.pathname]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('✅ Usuario autenticado, redirigiendo...');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  // Si ya está autenticado, mostrar loading
  if (isAuthenticated) {
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
