
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";

const Configuracion = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-ecosystem-primary mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 mr-3 text-blue-ecosystem-primary" />
            Configuración
          </h1>
          <p className="text-lg text-gray-ecosystem-text">
            Personaliza tu experiencia y ajustes de la aplicación
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-primary flex items-center justify-center shadow-ecosystem-soft">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-blue-ecosystem-primary">Perfil</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-ecosystem-text">
                Gestiona tu información personal y preferencias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-secondary flex items-center justify-center shadow-ecosystem-soft">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-blue-ecosystem-primary">Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-ecosystem-text">
                Configura alertas y notificaciones
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-dark flex items-center justify-center shadow-ecosystem-soft">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-blue-ecosystem-primary">Seguridad</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-ecosystem-text">
                Ajustes de privacidad y seguridad
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
