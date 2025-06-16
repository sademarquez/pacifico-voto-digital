
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MapPin, 
  Users, 
  Vote,
  Heart,
  Phone,
  MessageCircle,
  Calendar,
  Star,
  UserPlus
} from "lucide-react";

const VisitorSession = () => {
  const { user, isAuthenticated } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [voterData, setVoterData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleVoterRegistration = () => {
    console.log('Registrando votante:', voterData);
    // Aquí se implementaría la lógica de registro
    setShowRegistration(false);
    setVoterData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida para Visitantes */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {isAuthenticated && user?.role === 'visitante' 
              ? `¡Bienvenido, ${user.name}!` 
              : '¡Bienvenido a MI CAMPAÑA!'
            }
          </h1>
          <p className="text-lg opacity-90 mb-4">
            Descubre lo que está pasando en tu comunidad y forma parte del cambio
          </p>
          <div className="flex justify-center items-center gap-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-yellow-300 font-semibold">Tu voz cuenta, tu voto transforma</span>
          </div>
        </div>
      </div>

      {/* Panel de Información Comunitaria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800">Comunidad Activa</h3>
            <p className="text-2xl font-bold text-blue-900">2,341</p>
            <p className="text-sm text-blue-600">vecinos registrados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <Vote className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Participación</h3>
            <p className="text-2xl font-bold text-green-900">87%</p>
            <p className="text-sm text-green-600">de participación activa</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800">Eventos</h3>
            <p className="text-2xl font-bold text-purple-900">12</p>
            <p className="text-sm text-purple-600">eventos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Registro de Votantes */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            ¡Únete a Nuestra Comunidad!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!showRegistration ? (
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Regístrate para recibir información importante de tu comunidad y participar en las decisiones que nos afectan a todos.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setShowRegistration(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Registrarme como Votante
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Más Información
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Formulario de Registro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={voterData.name}
                    onChange={(e) => setVoterData({...voterData, name: e.target.value})}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={voterData.phone}
                    onChange={(e) => setVoterData({...voterData, phone: e.target.value})}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={voterData.email}
                    onChange={(e) => setVoterData({...voterData, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={voterData.address}
                    onChange={(e) => setVoterData({...voterData, address: e.target.value})}
                    placeholder="Tu dirección"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  onClick={handleVoterRegistration}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Confirmar Registro
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de Contacto */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              ¿Necesitas más información?
            </h3>
            <p className="text-blue-700 mb-4">
              Estamos aquí para ayudarte y responder todas tus preguntas.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                Llámanos
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorSession;
