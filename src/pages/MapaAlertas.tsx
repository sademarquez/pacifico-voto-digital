import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Circle as CircleIcon, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Navigation, 
  Eye, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Home,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Building,
  UserPlus,
  MessageCircle,
  Star,
  X
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'logistics' | 'social' | 'political';
  status: 'active' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  territory: {
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
  } | null;
}

const MapaAlertas = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState({ lat: 4.60971, lng: -74.08175 });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedTerritory, setSelectedTerritory] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [radiusFilter, setRadiusFilter] = useState(2000);
  const [showFunnel, setShowFunnel] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userSector, setUserSector] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    interests: [] as string[],
    priority: ''
  });

  const candidateAlerts: Alert[] = [
    {
      id: '1',
      title: '🏗️ Nueva Propuesta: Centro Comunitario',
      description: 'Juan Carlos propone construir un moderno centro comunitario con biblioteca, salas de capacitación y espacios deportivos para el sector.',
      type: 'social',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '1',
        name: 'Chapinero',
        coordinates: { lat: 4.6497, lng: -74.0647 }
      }
    },
    {
      id: '2',
      title: '🚨 Plan de Seguridad Integral',
      description: 'Instalación programada de 50 nuevas cámaras HD y creación de la app comunitaria de alertas tempranas.',
      type: 'security',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '2',
        name: 'Suba',
        coordinates: { lat: 4.7588, lng: -74.0608 }
      }
    },
    {
      id: '3',
      title: '💼 Feria de Empleo Comunitaria',
      description: 'Este sábado: gran feria de empleo con más de 200 vacantes disponibles y capacitaciones gratuitas.',
      type: 'social',
      status: 'active',
      priority: 'medium',
      created_at: new Date().toISOString(),
      territory: {
        id: '3',
        name: 'Kennedy',
        coordinates: { lat: 4.6276, lng: -74.1378 }
      }
    },
    {
      id: '4',
      title: '🏠 Proyecto Vivienda Digna',
      description: 'Lanzamiento del programa de subsidios habitacionales: hasta 50% de descuento para familias trabajadoras.',
      type: 'social',
      status: 'active',
      priority: 'high',
      created_at: new Date().toISOString(),
      territory: {
        id: '4',
        name: 'Usaquén',
        coordinates: { lat: 4.6951, lng: -74.0308 }
      }
    },
    {
      id: '5',
      title: '🌐 Internet Gratuito Comunitario',
      description: 'Habilitación de zonas WiFi gratuitas en parques y centros comunitarios del sector.',
      type: 'logistics',
      status: 'active',
      priority: 'medium',
      created_at: new Date().toISOString(),
      territory: {
        id: '5',
        name: 'Engativá',
        coordinates: { lat: 4.6776, lng: -74.1024 }
      }
    }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setZoomLevel(14);
          determineSector(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation({ lat: 4.60971, lng: -74.08175 });
          setUserSector('Centro');
        }
      );
    }
  }, []);

  const determineSector = (location: {lat: number, lng: number}) => {
    if (location.lat > 4.65) {
      setUserSector('Norte (Chapinero/Usaquén)');
    } else if (location.lat > 4.60) {
      setUserSector('Centro (La Candelaria/Teusaquillo)');
    } else if (location.lat > 4.55) {
      setUserSector('Sur (Kennedy/Bosa)');
    } else {
      setUserSector('Periferia (Suba/Engativá)');
    }
  };

  const { data: alerts = candidateAlerts, isLoading } = useQuery({
    queryKey: ['alerts-map'],
    queryFn: async (): Promise<Alert[]> => {
      if (!isAuthenticated) {
        return candidateAlerts;
      }

      let { data, error } = await supabase
        .from('alerts')
        .select(`
          id,
          title,
          description,
          type,
          status,
          priority,
          created_at,
          territory:territories (
            id,
            name,
            coordinates
          )
        `);
      
      if (error) {
        console.error("Error fetching alerts for map:", error);
        return candidateAlerts;
      }

      const validAlerts = data.filter(alert => 
        alert.territory && 
        alert.territory.coordinates &&
        typeof (alert.territory.coordinates as any).lat === 'number' &&
        typeof (alert.territory.coordinates as any).lng === 'number'
      );

      return validAlerts as Alert[];
    },
    refetchOnWindowFocus: false,
  });

  const filteredAlerts = userLocation 
    ? alerts.filter(alert => {
        if (!alert.territory?.coordinates) return false;
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          (alert.territory.coordinates as any).lat,
          (alert.territory.coordinates as any).lng
        );
        return distance <= radiusFilter;
      })
    : alerts;

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const territories = [
    { id: "chapinero", name: "Chapinero" },
    { id: "suba", name: "Suba" },
    { id: "usaquen", name: "Usaquén" },
    { id: "kennedy", name: "Kennedy" },
    { id: "engativa", name: "Engativá" }
  ];

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-100 text-red-800 border-red-200';
      case 'logistics': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'social': return 'bg-green-100 text-green-800 border-green-200';
      case 'political': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'security': return '#ef4444';
      case 'logistics': return '#3b82f6';
      case 'social': return '#10b981';
      case 'political': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const propuestas = [
    {
      icon: Home,
      title: 'Vivienda Digna',
      subtitle: 'Proyectos habitacionales accesibles',
      description: 'Facilitaremos el acceso a vivienda propia con subsidios y financiación especial para familias trabajadoras.',
      benefits: ['Subsidios hasta 50%', 'Créditos 0% interés', 'Lotes urbanizados']
    },
    {
      icon: Briefcase,
      title: 'Empleo y Economía',
      subtitle: 'Oportunidades laborales locales',
      description: 'Crearemos 5,000 empleos directos promoviendo el emprendimiento y atrayendo empresas a nuestra región.',
      benefits: ['Incubadoras empresariales', 'Capacitación gratuita', 'Microcréditos']
    },
    {
      icon: GraduationCap,
      title: 'Educación de Calidad',
      subtitle: 'Futuro brillante para nuestros hijos',
      description: 'Modernizaremos colegios, aumentaremos becas universitarias y crearemos centros tecnológicos.',
      benefits: ['Tecnología en aulas', 'Becas 100%', 'Idiomas gratis']
    },
    {
      icon: Shield,
      title: 'Seguridad Ciudadana',
      subtitle: 'Calles seguras para todos',
      description: 'Implementaremos un sistema integral de seguridad con cámaras, alarmas comunitarias y más policía.',
      benefits: ['Cámaras HD 24/7', 'App de alertas', 'Policía comunitaria']
    },
    {
      icon: Zap,
      title: 'Servicios Públicos',
      subtitle: 'Infraestructura moderna y eficiente',
      description: 'Garantizaremos agua potable, energía estable e internet de alta velocidad para todos los sectores.',
      benefits: ['Agua 24 horas', 'Energía confiable', 'Internet fibra óptica']
    },
    {
      icon: Building,
      title: 'Desarrollo Urbano',
      subtitle: 'Espacios dignos para vivir',
      description: 'Construiremos parques, mejoraremos vías, y crearemos centros comerciales y deportivos.',
      benefits: ['Parques ecológicos', 'Vías pavimentadas', 'Centros deportivos']
    }
  ];

  const testimonios = [
    {
      name: 'María González',
      sector: 'Chapinero',
      role: 'Madre de familia',
      testimonial: 'Por fin alguien que entiende nuestras necesidades. Sus propuestas de educación transformarán el futuro de mis hijos.',
      avatar: '👩‍💼'
    },
    {
      name: 'Carlos Ruiz',
      sector: 'Kennedy',
      role: 'Comerciante',
      testimonial: 'Como pequeño empresario, veo esperanza en sus planes de empleo. Necesitamos más oportunidades aquí.',
      avatar: '👨‍💼'
    },
    {
      name: 'Ana Morales',
      sector: 'Suba',
      role: 'Docente',
      testimonial: 'Sus propuestas educativas son realistas y necesarias. Finalmente un candidato que prioriza la educación.',
      avatar: '👩‍🏫'
    }
  ];

  const handleStepForward = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    console.log('User location:', userLocation);
    console.log('User sector:', userSector);
    setCurrentStep(4);
  };

  const mapStyles = {
    height: '500px',
    width: '100%'
  };

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  const FunnelModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <Button
          onClick={() => setShowFunnel(false)}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-10 border-white/30 text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Juan Carlos Mendoza</h2>
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  Nacido y criado en nuestra comunidad. Ingeniero, padre de familia, y líder comunitario 
                  con 15 años trabajando por el desarrollo de nuestros barrios.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white text-center mb-6">
                  Nuestras Propuestas para Transformar tu Comunidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propuestas.slice(0, 4).map((propuesta, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <propuesta.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">{propuesta.title}</h4>
                            <p className="text-blue-200 text-xs">{propuesta.subtitle}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-blue-100 text-sm mb-3">{propuesta.description}</p>
                        <div className="space-y-1">
                          {propuesta.benefits.slice(0, 2).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-blue-100 text-xs">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleStepForward}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-2xl"
                >
                  Ver Testimonios
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Lo que Dicen Nuestros Vecinos</h2>
                <p className="text-xl text-blue-200">Testimonios reales de personas como tú</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonios.map((testimonio, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-4">
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-2">{testimonio.avatar}</div>
                        <h4 className="text-white font-bold text-sm">{testimonio.name}</h4>
                        <p className="text-blue-200 text-xs">{testimonio.role} - {testimonio.sector}</p>
                      </div>
                      <blockquote className="text-blue-100 italic text-center text-sm">
                        "{testimonio.testimonial}"
                      </blockquote>
                      <div className="flex justify-center mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center space-y-4">
                <Button 
                  onClick={handleStepForward}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-2xl"
                >
                  Quiero Formar Parte
                  <UserPlus className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">
                    <UserPlus className="w-8 h-8 mx-auto mb-2" />
                    Regístrate en Nuestra Comunidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Tu nombre completo"
                        className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Tu número de teléfono"
                        className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">¿Qué temas te interesan más?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Vivienda', 'Empleo', 'Educación', 'Seguridad', 'Servicios', 'Desarrollo'].map((interest) => (
                        <Button
                          key={interest}
                          type="button"
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          onClick={() => handleInterestToggle(interest)}
                          className={`text-xs ${formData.interests.includes(interest) 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' 
                            : 'border-white/30 text-white hover:bg-white/10'
                          }`}
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-white">¿Cuál es tu mayor prioridad para la comunidad?</Label>
                    <Textarea
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      placeholder="Cuéntanos qué es lo más importante para ti..."
                      className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Confirmar Registro
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">¡Gracias por Unirte!</h2>
              <p className="text-xl text-blue-200 mb-6">
                Ahora eres parte de nuestra comunidad. Te mantendremos informado sobre nuestras propuestas.
              </p>
              <Button 
                onClick={() => {
                  setShowFunnel(false);
                  setCurrentStep(1);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl"
              >
                Explorar Mapa
                <MapPin className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {currentStep < 4 && (
            <div className="flex justify-center mt-6">
              <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= currentStep ? 'bg-yellow-400' : 'bg-white/30'
                    }`}
                  />
                ))}
                <span className="text-white text-xs ml-2">
                  Paso {currentStep} de 3
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-8 h-8" />
                Tu Comunidad en Acción
              </h1>
              <p className="text-blue-100 mt-1">
                Descubre las propuestas y proyectos de tu candidato en tu zona
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowFunnel(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold shadow-lg"
              >
                <Heart className="w-4 h-4 mr-2" />
                Conocer Candidato
              </Button>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Acceso Equipo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Navigation className="w-5 h-5 text-blue-600" />
                Filtros de Zona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu barrio..." />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((territory) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CircleIcon className="w-5 h-5 text-purple-600" />
                Radio de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={radiusFilter.toString()} onValueChange={(value) => setRadiusFilter(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-green-600" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{filteredAlerts.length}</div>
                <div className="text-sm text-gray-600">
                  {userLocation ? 'Propuestas cerca de ti' : 'Propuestas totales'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-6 h-6" />
              Mapa Interactivo de Propuestas
            </CardTitle>
            <p className="text-blue-100">
              Haz clic en los marcadores para ver detalles de cada propuesta
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapStyles}
                center={mapCenter}
                zoom={zoomLevel}
                options={mapOptions}
              >
                {filteredAlerts.map((alert) => (
                  <Marker
                    key={alert.id}
                    position={{
                      lat: (alert.territory?.coordinates as any).lat,
                      lng: (alert.territory?.coordinates as any).lng
                    }}
                    title={alert.title}
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                      scale: 12,
                      fillColor: getMarkerColor(alert.type),
                      fillOpacity: 0.8,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                    onClick={() => setSelectedAlert(alert)}
                  />
                ))}

                {userLocation && (
                  <>
                    <Marker
                      position={userLocation}
                      icon={{
                        path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                        scale: 8,
                        fillColor: '#4f46e5',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                      }}
                      title="Tu ubicación"
                    />
                    <Circle
                      center={userLocation}
                      radius={radiusFilter}
                      options={{
                        fillColor: '#4f46e5',
                        fillOpacity: 0.1,
                        strokeColor: '#4f46e5',
                        strokeOpacity: 0.3,
                        strokeWeight: 2,
                      }}
                    />
                  </>
                )}

                {selectedAlert && (
                  <InfoWindow
                    position={{
                      lat: (selectedAlert.territory?.coordinates as any).lat,
                      lng: (selectedAlert.territory?.coordinates as any).lng
                    }}
                    onCloseClick={() => setSelectedAlert(null)}
                  >
                    <div className="p-3 max-w-xs">
                      <h3 className="font-bold text-gray-900 mb-2">{selectedAlert.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{selectedAlert.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getAlertTypeColor(selectedAlert.type)}>
                          {selectedAlert.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <CircleIcon className={`w-3 h-3 ${getAlertPriorityColor(selectedAlert.priority)}`} />
                          <span className="text-xs text-gray-500">
                            {selectedAlert.territory?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">🎯 Propuestas Activas en tu Área</CardTitle>
                <p className="text-green-100">
                  {userLocation 
                    ? `Mostrando ${filteredAlerts.length} propuestas en un radio de ${radiusFilter/1000}km`
                    : `Mostrando todas las ${alerts.length} propuestas disponibles`
                  }
                </p>
              </div>
              <Button 
                onClick={() => setShowFunnel(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Unirme
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando propuestas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{alert.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{alert.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <Badge className={`${getAlertTypeColor(alert.type)} font-medium`}>
                            {alert.type === 'social' ? 'Social' : 
                             alert.type === 'security' ? 'Seguridad' :
                             alert.type === 'logistics' ? 'Servicios' : 'Político'}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <CircleIcon className={`w-4 h-4 ${getAlertPriorityColor(alert.priority)}`} />
                            <span className="text-xs text-gray-500 font-medium">
                              {alert.territory?.name}
                            </span>
                          </div>
                        </div>
                        {userLocation && alert.territory?.coordinates && (
                          <div className="text-xs text-blue-600 font-medium">
                            📍 {(calculateDistance(
                              userLocation.lat, 
                              userLocation.lng,
                              (alert.territory.coordinates as any).lat,
                              (alert.territory.coordinates as any).lng
                            ) / 1000).toFixed(1)} km de tu ubicación
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🚀 ¿Te Gustaron Nuestras Propuestas?</h2>
            <p className="text-xl mb-6 opacity-90">
              Únete a miles de vecinos que ya apoyan nuestro proyecto de transformación comunitaria
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowFunnel(true)}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Registrarme como Partidario
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 font-bold"
              >
                <Eye className="w-5 h-5 mr-2" />
                Seguir Explorando
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showFunnel && <FunnelModal />}
    </div>
  );
};

export default MapaAlertas;
