
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, MapPin, Phone, Mail } from "lucide-react";

const Estructura = () => {
  const estructura = [
    {
      nivel: "Coordinación General",
      responsable: "Ana García",
      municipio: "Popayán",
      telefono: "+57 300 123 4567",
      email: "ana.garcia@campaign.com",
      equipo: 45,
      color: "bg-purple-500"
    },
    {
      nivel: "Coordenador Zonal Norte",
      responsable: "Carlos Rodríguez",
      municipio: "Santander de Quilichao",
      telefono: "+57 301 234 5678",
      email: "carlos.rodriguez@campaign.com",
      equipo: 28,
      color: "bg-blue-500"
    },
    {
      nivel: "Coordenador Zonal Sur",
      responsable: "María López",
      municipio: "La Vega",
      telefono: "+57 302 345 6789",
      email: "maria.lopez@campaign.com",
      equipo: 32,
      color: "bg-green-500"
    },
    {
      nivel: "Coordenador Zonal Centro",
      responsable: "Diego Martínez",
      municipio: "Timbío",
      telefono: "+57 303 456 7890",
      email: "diego.martinez@campaign.com",
      equipo: 24,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-purple-600" />
          <span>Estructura Organizacional</span>
        </h1>
        <p className="text-gray-600">Organización y jerarquía del equipo de campaña</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {estructura.map((coord, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{coord.nivel}</CardTitle>
                <Badge className={`${coord.color} text-white`}>
                  <Users className="w-4 h-4 mr-1" />
                  {coord.equipo}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800">{coord.responsable}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{coord.municipio}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{coord.telefono}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{coord.email}</span>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Equipo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas Generales */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Estructura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">Coordinadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">129</div>
              <div className="text-sm text-gray-600">Total Equipo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">42</div>
              <div className="text-sm text-gray-600">Municipios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">Cobertura</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estructura;
