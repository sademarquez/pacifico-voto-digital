
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, Home, Shield, BarChart3, Network, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/registro", label: "Registro", icon: User },
    { href: "/mapa-alertas", label: "Mapa", icon: MapPin },
    { href: "/liderazgo", label: "Liderazgo", icon: Users },
    { href: "/red-ayudantes", label: "Red Ayudantes", icon: Network }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Si no hay usuario autenticado, no mostrar la navegación
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Navegación superior */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-blue-700 drop-shadow-sm">
                MI CAMPAÑA 2025
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600">{user.name} ({user.role})</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-blue-600 shadow-sm hover:shadow-md">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-blue-50 shadow-2xl">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="font-medium text-blue-700">{user.name}</p>
                      <p className="text-sm text-blue-600">Rol: {user.role}</p>
                    </div>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                          isActiveRoute(item.href)
                            ? 'bg-blue-700 text-white shadow-lg'
                            : 'text-blue-600 hover:bg-white hover:shadow-lg'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    <Button 
                      onClick={handleLogout}
                      className="bg-blue-700 hover:bg-blue-800 text-white mt-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Navegación inferior para móviles */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blue-200 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                isActiveRoute(item.href)
                  ? 'bg-blue-700 text-white shadow-lg transform scale-105'
                  : 'text-blue-600 hover:bg-blue-100 hover:text-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActiveRoute(item.href) ? 'drop-shadow-sm' : ''}`} />
              <span className={`text-xs font-medium ${isActiveRoute(item.href) ? 'drop-shadow-sm' : ''}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
