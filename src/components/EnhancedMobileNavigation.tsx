
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Bell,
  Search,
  Plus,
  Activity
} from "lucide-react";

const EnhancedMobileNavigation = () => {
  const { user, logout } = useSecureAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Inicio", icon: Home, priority: 1, color: "text-blue-600" },
    ];

    if (user?.role === 'master' || user?.role === 'desarrollador') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1, color: "text-purple-600" },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1, color: "text-green-600" },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 1, color: "text-red-600" }
      ];
    }

    if (user?.role === 'candidato') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1, color: "text-purple-600" },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1, color: "text-green-600" },
        { href: "/liderazgo", label: "Liderazgo", icon: Target, priority: 1, color: "text-orange-600" }
      ];
    }

    if (user?.role === 'lider') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1, color: "text-purple-600" },
        { href: "/mapa-alertas", label: "Territorio", icon: MapPin, priority: 1, color: "text-red-600" },
        { href: "/registro", label: "Registro", icon: Users, priority: 1, color: "text-green-600" }
      ];
    }

    if (user?.role === 'votante') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=visitor", label: "Participar", icon: Users, priority: 1, color: "text-green-600" },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 1, color: "text-red-600" },
        { href: "/mensajes", label: "Mensajes", icon: MessageSquare, priority: 1, color: "text-blue-600" }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const primaryItems = navigationItems.filter(item => item.priority === 1).slice(0, 4);

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
      {/* Header móvil ultra moderno */}
      <div className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-primary">MI CAMPAÑA</h1>
              <p className="text-xs text-gray-500">2025 • IA Avanzada</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
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

      {/* Menú lateral ultra moderno */}
      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-xl shadow-2xl animate-slide-elegant">
            <div className="p-6 space-y-6">
              {/* Header del menú */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <Badge className="bg-gradient-accent text-white text-xs">
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gradient-surface rounded-xl">
                  <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">85%</div>
                  <div className="text-xs text-gray-600">Actividad</div>
                </div>
                <div className="text-center p-3 bg-gradient-surface rounded-xl">
                  <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">247</div>
                  <div className="text-xs text-gray-600">Conexiones</div>
                </div>
                <div className="text-center p-3 bg-gradient-surface rounded-xl">
                  <BarChart3 className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">92%</div>
                  <div className="text-xs text-gray-600">Impacto</div>
                </div>
              </div>

              {/* Navegación principal */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Navegación</h4>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                        active
                          ? 'bg-gradient-primary text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        active 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : item.color}`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        {active && (
                          <div className="text-xs opacity-80">Activo</div>
                        )}
                      </div>
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Acciones</h4>
                <Button className="w-full justify-start modern-interactive-button">
                  <Plus className="w-4 h-4 mr-3" />
                  Nueva Acción
                </Button>
                <Link
                  to="/configuracion"
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configuración</span>
                </Link>
              </div>

              {/* Cerrar sesión */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 justify-start"
                  variant="ghost"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación inferior ultra moderna */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative ${
                  active 
                    ? 'bg-gradient-primary text-white shadow-lg transform -translate-y-1' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
                {active && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                )}
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

export default EnhancedMobileNavigation;
