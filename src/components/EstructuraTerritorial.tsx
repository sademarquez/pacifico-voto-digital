
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  Building2,
  Crown,
  Star,
  Navigation,
  UserCheck
} from "lucide-react";

interface EstructuraTerritorialProps {
  busqueda: string;
  filtro: string;
}

interface Profile {
  id: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  created_at: string;
}

const EstructuraTerritorial: React.FC<EstructuraTerritorialProps> = ({ busqueda, filtro }) => {
  const { user } = useAuth();
  const { getPermissions } = useDataSegregation();
  const permissions = getPermissions();

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['team-structure', user?.id],
    queryFn: async (): Promise<Profile[]> => {
      if (!user) return [];

      console.log('🔍 Consultando estructura del equipo...');
      
      let query = supabase
        .from('profiles')
        .select('id, name, role, created_at');

      // Aplicar filtros según el rol del usuario
      if (user.role === 'lider') {
        // Los líderes solo ven votantes
        query = query.eq('role', 'votante');
      } else if (user.role === 'candidato') {
        // Los candidatos ven líderes y votantes
        query = query.in('role', ['lider', 'votante']);
      } else if (user.role === 'master') {
        // Master ve candidatos, líderes y votantes
        query = query.in('role', ['candidato', 'lider', 'votante']);
      }
      // Desarrollador ve todos (sin filtro adicional)

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error consultando perfiles:', error);
        throw error;
      }

      console.log('✅ Perfiles obtenidos:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'desarrollador': return Star;
      case 'master': return Crown;
      case 'candidato': return Building2;
      case 'lider': return Users;
      case 'votante': return UserCheck;
      default: return Navigation;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'candidato': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'lider': return 'bg-green-100 text-green-800 border-green-300';
      case 'votante': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filtrar perfiles según búsqueda y filtro
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !busqueda || 
      profile.name?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchesFilter = filtro === 'todos' || 
      (filtro === 'lideres' && profile.role === 'lider') ||
      (filtro === 'ayudantes' && profile.role === 'votante');
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando estructura del equipo...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <Building2 className="w-12 h-12 mx-auto mb-2" />
            <p>Error cargando la estructura</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-700">
              {filteredProfiles.length}
            </div>
            <div className="text-sm text-slate-600">Total</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-700">
              {filteredProfiles.filter(p => p.role === 'lider').length}
            </div>
            <div className="text-sm text-green-600">Líderes</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">
              {filteredProfiles.filter(p => p.role === 'candidato').length}
            </div>
            <div className="text-sm text-blue-600">Candidatos</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">
              {filteredProfiles.filter(p => p.role === 'votante').length}
            </div>
            <div className="text-sm text-gray-600">Votantes</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de miembros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Miembros del Equipo ({filteredProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron miembros</p>
              {busqueda && (
                <p className="text-sm mt-2">
                  Intenta con una búsqueda diferente
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((profile) => {
                const RoleIcon = getRoleIcon(profile.role);
                return (
                  <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <RoleIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">
                            {profile.name || 'Sin nombre'}
                          </h3>
                          <Badge className={getRoleColor(profile.role)}>
                            {profile.role}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Activo desde {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="w-4 h-4 mr-1" />
                          Contactar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="w-4 h-4 mr-1" />
                          Mensaje
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstructuraTerritorial;
