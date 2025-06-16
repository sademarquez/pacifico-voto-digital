
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface SimpleProtectedRouteProps {
  children: React.ReactNode;
}

const SimpleProtectedRoute = ({ children }: SimpleProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('🛡️ Protected Route Check:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      hasRedirected
    });

    if (!isLoading && !isAuthenticated && !hasRedirected) {
      console.log('🔒 No autenticado, redirigiendo a login...');
      setHasRedirected(true);
      
      // Usar setTimeout para evitar problemas de re-render
      setTimeout(() => {
        navigate('/simple-login', { 
          replace: true, 
          state: { from: location }
        });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, location, hasRedirected]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && hasRedirected) {
    return null; // Evitar flash mientras redirige
  }

  if (isAuthenticated && user) {
    console.log('✅ Acceso concedido a:', location.pathname);
    return <>{children}</>;
  }

  return null;
};

export default SimpleProtectedRoute;
