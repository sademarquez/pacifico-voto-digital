
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, Home, Shield, BarChart3, Network, LogOut } from "lucide-react";
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gold/20 shadow-elegant">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-gold">
                <img 
                  src="/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png" 
                  alt="MI CAMPAÑA Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl text-black-elegant drop-shadow-sm">
                MI CAMPAÑA 2025
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-elegant ${
                    isActiveRoute(item.href)
                      ? 'bg-black-elegant text-gold shadow-gold'
                      : 'text-black-elegant hover:bg-gold/10 hover:text-gold'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black-elegant">{user.name} ({user.role})</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-gold text-gold hover:bg-gold/10"
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
                  <Button variant="ghost" size="icon" className="text-black-elegant shadow-sm hover:shadow-elegant">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-elegant shadow-elegant">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="p-3 bg-white/10 rounded-lg shadow-gold border border-gold/20">
                      <p className="font-medium text-gold">{user.name}</p>
                      <p className="text-sm text-gold/80">Rol: {user.role}</p>
                    </div>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-elegant ${
                          isActiveRoute(item.href)
                            ? 'bg-gold text-black-elegant shadow-gold'
                            : 'text-gold hover:bg-white/10 hover:shadow-gold'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    <Button 
                      onClick={handleLogout}
                      className="bg-gold hover:bg-gold-dark text-black-elegant mt-6 rounded-lg shadow-gold hover:shadow-gold-dark transition-shadow"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gold/20 shadow-elegant">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                isActiveRoute(item.href)
                  ? 'bg-black-elegant text-gold shadow-gold transform scale-105'
                  : 'text-black-elegant hover:bg-gold/10 hover:text-gold shadow-sm hover:shadow-elegant'
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
