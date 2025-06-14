
import { useState } from "react";
import { Crown } from "lucide-react";
import { Lider } from "@/types/liderazgo";
import EstadisticasLiderazgo from "@/components/liderazgo/EstadisticasLiderazgo";
import TarjetaLider from "@/components/liderazgo/TarjetaLider";
import DetallesLider from "@/components/liderazgo/DetallesLider";
import CallToActionLiderazgo from "@/components/liderazgo/CallToActionLiderazgo";

// Datos de ejemplo para líderes
const lideresEjemplo: Lider[] = [
  {
    id: "LID001",
    nombre: "María González",
    rol: "Líder Municipal",
    municipio: "Buenaventura",
    zona: "Zona Oriental",
    telefono: "+57 300 123 4567",
    miembrosRegistrados: 45,
    alertasReportadas: 12,
    puntosCompromiso: 890,
    nivel: "Oro",
    fechaIngreso: "2023-08-15"
  },
  {
    id: "LID002",
    nombre: "Carlos Ramírez",
    rol: "Líder Zonal",
    municipio: "Tumaco",
    zona: "Centro",
    telefono: "+57 301 234 5678",
    miembrosRegistrados: 32,
    alertasReportadas: 8,
    puntosCompromiso: 650,
    nivel: "Plata",
    fechaIngreso: "2023-09-22"
  },
  {
    id: "LID003",
    nombre: "Ana Mosquera",
    rol: "Líder de Barrio",
    municipio: "Quibdó",
    zona: "Barrio Kennedy",
    telefono: "+57 302 345 6789",
    miembrosRegistrados: 28,
    alertasReportadas: 15,
    puntosCompromiso: 720,
    nivel: "Plata",
    fechaIngreso: "2023-07-10"
  },
  {
    id: "LID004",
    nombre: "Luis Parra",
    rol: "Líder de Vereda",
    municipio: "Guapi",
    zona: "Vereda San José",
    telefono: "+57 303 456 7890",
    miembrosRegistrados: 18,
    alertasReportadas: 5,
    puntosCompromiso: 420,
    nivel: "Bronce",
    fechaIngreso: "2023-10-05"
  }
];

const Liderazgo = () => {
  const [lideres] = useState<Lider[]>(lideresEjemplo);
  const [liderSeleccionado, setLiderSeleccionado] = useState<Lider | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8 pb-20 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center drop-shadow-sm">
            <Crown className="w-8 h-8 mr-3 text-slate-600 drop-shadow-sm" />
            Red de Liderazgo Territorial
          </h1>
          <p className="text-lg text-slate-600 drop-shadow-sm">
            Conoce a los líderes que están transformando sus comunidades
          </p>
        </div>

        {/* Estadísticas Generales */}
        <EstadisticasLiderazgo lideres={lideres} />

        {/* Lista de Líderes */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {lideres.map((lider) => (
            <TarjetaLider 
              key={lider.id} 
              lider={lider} 
              onClick={setLiderSeleccionado}
            />
          ))}
        </div>

        {/* Detalles del Líder Seleccionado */}
        {liderSeleccionado && (
          <DetallesLider 
            lider={liderSeleccionado} 
            onClose={() => setLiderSeleccionado(null)}
          />
        )}

        {/* Call to Action */}
        <CallToActionLiderazgo />
      </div>
    </div>
  );
};

export default Liderazgo;
