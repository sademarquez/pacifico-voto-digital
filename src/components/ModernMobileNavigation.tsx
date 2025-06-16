import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Fix: Import correcto del contexto
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { 
  Home, 
  Users, 
  MapPin, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Target,
  MessageSquare,
  Calendar,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ModernMobileNavigation = () => {
  // Fix: Usar el contexto correcto
  const { user, logout } = useSimpleAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/simple-login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Inicio", icon: Home, priority: 1 },
    ];

    if (user?.role === 'master' || user?.role === 'desarrollador') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 2 },
        { href: "/informes", label: "Informes", icon: BarChart3, priority: 3 }
      ];
    }

    if (user?.role === 'candidato') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1 },
        { href: "/liderazgo", label: "Liderazgo", icon: Target, priority: 2 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 3 }
      ];
    }

    if (user?.role === 'lider') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/mapa-alertas", label: "Territorio", icon: MapPin, priority: 1 },
        { href: "/registro", label: "Registro", icon: Users, priority: 2 },
        { href: "/informes", label: "Informes", icon: BarChart3, priority: 3 }
      ];
    }

    if (user?.role === 'votante') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=visitor", label: "Participar", icon: Users, priority: 1 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 2 },
        { href: "/informes", label: "Progreso", icon: BarChart3, priority: 3 }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const primaryItems = navigationItems.filter(item => item.priority === 1).slice(0, 4);
  const secondaryItems = navigationItems.filter(item => item.priority > 1);

  const isActiveRoute = (href: string) => {
    if (href.includes('?tab=')) {
      const [path, query] = href.split('?');
      const params = new URLSearchParams(query);
      const tab = params.get('tab');
      return location.pathname === path && new URLSearchParams(location.search).get('tab') === tab;
    }
    return location.pathname === href;
  };

  if (!user) return null;

  return (
    <>
      {/* Header móvil moderno */}
      <div className="header-modern sticky top-0 z-40 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-bg-primary rounded-xl flex items-center justify-center shadow-modern-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text-primary">MI CAMPAÑA</h1>
              <p className="text-xs text-gray-500">2025 - Automatización IA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
              {user.role.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="relative p-2"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay del menú */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setShowMenu(false)}
        >
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-modern-xl animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Menú Principal</h2>
                  <p className="text-sm text-gray-500">{user.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        active
                          ? 'gradient-bg-primary text-white shadow-modern-md'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <Link
                  to="/configuracion"
                  className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configuración</span>
                </Link>
                
                <Button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center space-x-3 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
                  variant="ghost"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación inferior moderna */}
      <div className="mobile-nav-modern md:hidden">
        <div className="grid grid-cols-4 gap-1 h-full">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Espaciado para navegación inferior */}
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default ModernMobileNavigation;
