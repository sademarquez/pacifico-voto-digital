
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, BarChart3, Network, LogOut, FileText, Shield, Zap, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

const ModernMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useSimpleAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/registro", label: "Registro", icon: User },
    { href: "/mapa-alertas", label: "Mapa", icon: MapPin },
    { href: "/liderazgo", label: "Liderazgo", icon: Users },
    { href: "/configuracion", label: "Configuración", icon: Shield }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/simple-login");
      setIsOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Solo mostrar en móvil si hay usuario autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="md:hidden">
      {/* Navegación flotante en móvil */}
      <div className="fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-blue-200"
            >
              <Menu className="w-6 h-6 text-blue-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col space-y-6 mt-8">
              {/* Header de usuario */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-blue-100 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Navegación */}
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const active = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                  variant="ghost"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ModernMobileNavigation;
