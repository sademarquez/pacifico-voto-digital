
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Crown, 
  Users, 
  Star,
  Building2,
  MapPin
} from "lucide-react";

const UserHeader = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleConfig = () => {
    switch (user.role) {
      case 'desarrollador':
        return {
          icon: Shield,
          title: "Panel de Desarrollador",
          subtitle: "Control total del sistema",
          gradient: "from-red-600 to-red-800",
          description: "Acceso completo a todas las funcionalidades del sistema",
          bgPattern: "bg-red-50"
        };
      case 'master':
        return {
          icon: Shield,
          title: "Panel Master",
          subtitle: "Administración de campaña",
          gradient: "from-purple-600 to-purple-800",
          description: "Gestión completa de territorios, usuarios y estrategias",
          bgPattern: "bg-purple-50"
        };
      case 'candidato':
        return {
          icon: Crown,
          title: "Panel del Candidato",
          subtitle: "Liderazgo de campaña",
          gradient: "from-blue-600 to-blue-800",
          description: "Coordina tu equipo y monitorea el progreso de la campaña",
          bgPattern: "bg-blue-50"
        };
      case 'lider':
        return {
          icon: Building2,
          title: "Panel de Liderazgo",
          subtitle: "Gestión territorial",
          gradient: "from-green-600 to-green-800",
          description: "Administra tu territorio y equipo de trabajo",
          bgPattern: "bg-green-50"
        };
      case 'votante':
        return {
          icon: Users,
          title: "Panel del Colaborador",
          subtitle: "Participación activa",
          gradient: "from-indigo-600 to-indigo-800",
          description: "Contribuye al éxito de nuestra campaña",
          bgPattern: "bg-indigo-50"
        };
      default:
        return {
          icon: Users,
          title: "Panel de Usuario",
          subtitle: "Mi Campaña 2025",
          gradient: "from-gray-600 to-gray-800",
          description: "Bienvenido al sistema electoral",
          bgPattern: "bg-gray-50"
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  return (
    <Card className={`mb-6 border-0 shadow-lg ${config.bgPattern}`}>
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${config.gradient} text-white p-6 rounded-lg`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{config.title}</h1>
              <p className="text-white/90 text-lg">{config.subtitle}</p>
              <p className="text-white/80 text-sm mt-2">{config.description}</p>
            </div>
            <div className="text-right">
              <div className="text-white/90 text-sm">Bienvenido</div>
              <div className="text-xl font-semibold">{user.name}</div>
              <Badge className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
                {user.role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHeader;
