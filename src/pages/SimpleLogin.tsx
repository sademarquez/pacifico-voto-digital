
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

  // Redirigir si ya está autentic

ado
  useEffect(() => {
    if (isAuthenticated && !isLoading && !hasRedirected) {
      console.log('✅ Usuario autenticado, redirigiendo...');
      setHasRedirected(true);
      const from = location.state?.from?.pathname || '/dashboard';
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, location.state, hasRedirected]);

  if (isAuthenticated && !hasRedirected) {
    return (
      <PageLayout borderVariant="gradient" borderColor="green">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/95 via-amber-50/90 to-yellow-50/85">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-amber-800">¡Autenticado con éxito!</h2>
            <p className="text-amber-600">Redirigiendo al dashboard premium...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (hasRedirected) {
    return null;
  }

  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="blue"
      className="bg-gradient-to-br from-white/95 via-amber-50/90 to-yellow-50/85 min-h-screen"
    >
      <div className="relative overflow-hidden">
        <SystemHealthIndicator />
        
        {/* Fondo elegante con efectos */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(184,134,11,0.05)_120deg,transparent_240deg)]"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text-gold mb-2">MI CAMPAÑA 2025</h1>
              <p className="text-amber-800 text-lg">Sistema Electoral Premium</p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <LoginForm
              onLogin={login}
              isLoading={isLoading}
              authError={authError}
              clearAuthError={clearAuthError}
            />
            
            <div className="mt-8 text-center">
              <p className="text-amber-700 text-sm">
                Todas las credenciales utilizan la contraseña: <span className="font-mono font-bold">12345678</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SimpleLogin;
