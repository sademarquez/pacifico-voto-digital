
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Users, Bell } from "lucide-react";

const Mensajes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 mr-3 text-slate-600" />
            Sistema de Mensajería
          </h1>
          <p className="text-lg text-slate-600">
            Comunicación directa con líderes y equipo de campaña
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Mensajes Directos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Comunicación privada con líderes y coordinadores
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Grupos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Coordinación por equipos y territorios
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-stone-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Alertas importantes y actualizaciones
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
