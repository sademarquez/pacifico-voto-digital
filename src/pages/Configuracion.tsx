
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield } from "lucide-react";

const Configuracion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 mr-3 text-slate-600" />
            Configuración
          </h1>
          <p className="text-lg text-slate-600">
            Personaliza tu experiencia y ajustes de la aplicación
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Perfil</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gestiona tu información personal y preferencias
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Configura alertas y notificaciones
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-stone-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Seguridad</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
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
