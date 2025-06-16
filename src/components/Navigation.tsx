
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, Home, Shield, BarChart3, Network, LogOut, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSecureAuth } from "../contexts/SecureAuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useSecureAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/registro", label: "Registro", icon: User },
    { href: "/mapa-alertas", label: "Mapa", icon: MapPin },
    { href: "/informes", label: "Informes", icon: FileText },
    { href: "/liderazgo", label: "Liderazgo", icon: Users },
    { href: "/red-ayudantes", label: "Red Ayudantes", icon: Network }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Si no hay usuario autenticado, no mostrar la navegación
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Navegación superior */}
      <nav className="sticky top-0 z-50 nav-ecosystem">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-ecosystem-soft bg-blue-ecosystem-primary p-2">
                <img 
                  src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                  alt="MI CAMPAÑA Logo" 
                  className="w-full h-full object-cover filter brightness-0 invert"
                />
              </div>
              <span className="font-bold text-xl text-blue-ecosystem-primary">
                MI CAMPAÑA 2025
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-ecosystem-soft hover:shadow-ecosystem-medium ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-ecosystem-primary text-white shadow-blue-glow'
                      : 'text-gray-ecosystem-text hover:bg-gray-ecosystem-light hover:text-blue-ecosystem-primary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-ecosystem-border">
                <div className="text-sm">
                  <p className="font-medium text-gray-ecosystem-dark">{user.name}</p>
                  <p className="text-xs text-gray-ecosystem-text">({user.role})</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-gray-ecosystem-border text-gray-ecosystem-text hover:bg-gray-ecosystem-light hover:text-blue-ecosystem-primary hover:border-blue-ecosystem-primary"
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
                  <Button variant="ghost" size="icon" className="text-blue-ecosystem-primary shadow-ecosystem-soft hover:shadow-ecosystem-medium hover:bg-gray-ecosystem-light">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white shadow-ecosystem-large border-gray-ecosystem-border">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="p-4 bg-gray-ecosystem-light rounded-lg shadow-ecosystem-soft border border-gray-ecosystem-border">
                      <p className="font-medium text-blue-ecosystem-primary">{user.name}</p>
                      <p className="text-sm text-gray-ecosystem-text">Rol: {user.role}</p>
                    </div>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 shadow-ecosystem-soft hover:shadow-ecosystem-medium ${
                          isActiveRoute(item.href)
                            ? 'bg-blue-ecosystem-primary text-white shadow-blue-glow'
                            : 'text-gray-ecosystem-text hover:bg-gray-ecosystem-light hover:text-blue-ecosystem-primary'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    <Button 
                      onClick={handleLogout}
                      className="btn-primary-ecosystem mt-6 shadow-ecosystem-medium hover:shadow-ecosystem-large"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-ecosystem-border shadow-ecosystem-large">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                isActiveRoute(item.href)
                  ? 'bg-blue-ecosystem-primary text-white shadow-blue-glow transform scale-105'
                  : 'text-gray-ecosystem-text hover:bg-gray-ecosystem-light hover:text-blue-ecosystem-primary shadow-ecosystem-soft hover:shadow-ecosystem-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActiveRoute(item.href) ? 'filter drop-shadow-sm' : ''}`} />
              <span className={`text-xs font-medium ${isActiveRoute(item.href) ? 'filter drop-shadow-sm' : ''}`}>
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
