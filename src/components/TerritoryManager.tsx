
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDataSegregation } from "@/hooks/useDataSegregation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Plus, 
  Users, 
  Edit, 
  Trash2,
  TreePine,
  Building2,
  Home
} from "lucide-react";

const TerritoryManager = () => {
  const { user } = useAuth();
  const { getTerritoryFilter, canCreateTerritory } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newTerritory, setNewTerritory] = useState({
    name: '',
    type: '' as 'departamento' | 'municipio' | 'corregimiento' | 'vereda' | 'barrio' | 'sector' | '',
    parent_id: '',
    population_estimate: '',
    voter_estimate: '',
    responsible_user_id: ''
  });

  // Query para obtener territorios
  const { data: territories = [], isLoading } = useQuery({
    queryKey: ['territories'],
    queryFn: async () => {
      if (!supabase) return [];
      const filter = getTerritoryFilter();
      let query = supabase
        .from('territories')
        .select(`
          *,
          parent:territories!territories_parent_id_fkey(name),
          responsible:profiles!territories_responsible_user_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (filter && Object.keys(filter).length > 0) {
        // Aplicar filtros según el rol del usuario
        if (filter.or) {
          query = query.or(filter.or);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener usuarios disponibles como responsables
  const { data: availableUsers = [] } = useQuery({
    queryKey: ['available-users'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('role', ['candidato', 'votante']);
      return data || [];
    },
    enabled: !!supabase
  });

  // Mutation para crear territorio
  const createTerritoryMutation = useMutation({
    mutationFn: async (territoryData: typeof newTerritory) => {
      if (!supabase || !user) throw new Error("No disponible");

      const { data, error } = await supabase
        .from('territories')
        .insert({
          name: territoryData.name,
          type: territoryData.type,
          parent_id: territoryData.parent_id || null,
          population_estimate: territoryData.population_estimate ? parseInt(territoryData.population_estimate) : null,
          voter_estimate: territoryData.voter_estimate ? parseInt(territoryData.voter_estimate) : null,
          responsible_user_id: territoryData.responsible_user_id || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Territorio creado",
        description: "El territorio ha sido creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ['territories'] });
      setNewTerritory({
        name: '',
        type: '',
        parent_id: '',
        population_estimate: '',
        voter_estimate: '',
        responsible_user_id: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el territorio",
        variant: "destructive",
      });
    }
  });

  const handleCreateTerritory = () => {
    if (!newTerritory.name || !newTerritory.type) {
      toast({
        title: "Error",
        description: "Nombre y tipo son requeridos",
        variant: "destructive"
      });
      return;
    }
    createTerritoryMutation.mutate(newTerritory);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'departamento': return Building2;
      case 'municipio': return TreePine;
      case 'corregimiento': return MapPin;
      case 'vereda': return Home;
      case 'barrio': return Home;
      case 'sector': return MapPin;
      default: return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'departamento': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'municipio': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'corregimiento': return 'bg-green-100 text-green-800 border-green-300';
      case 'vereda': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'barrio': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'sector': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión Territorial</h1>
          <p className="text-gray-600">Administra la estructura territorial de la campaña</p>
        </div>
      </div>

      {/* Formulario para crear territorio */}
      {canCreateTerritory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Nuevo Territorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Territorio</Label>
                <Input
                  id="name"
                  value={newTerritory.name}
                  onChange={(e) => setNewTerritory({...newTerritory, name: e.target.value})}
                  placeholder="Ej: Popayán Centro"
                  disabled={createTerritoryMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Territorio</Label>
                <Select 
                  value={newTerritory.type} 
                  onValueChange={(value) => setNewTerritory({...newTerritory, type: value as any})}
                  disabled={createTerritoryMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="municipio">Municipio</SelectItem>
                    <SelectItem value="corregimiento">Corregimiento</SelectItem>
                    <SelectItem value="vereda">Vereda</SelectItem>
                    <SelectItem value="barrio">Barrio</SelectItem>
                    <SelectItem value="sector">Sector</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Territorio Padre</Label>
                <Select 
                  value={newTerritory.parent_id} 
                  onValueChange={(value) => setNewTerritory({...newTerritory, parent_id: value})}
                  disabled={createTerritoryMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona territorio padre (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {territories.map((territory: any) => (
                      <SelectItem key={territory.id} value={territory.id}>
                        {territory.name} ({territory.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Responsable</Label>
                <Select 
                  value={newTerritory.responsible_user_id} 
                  onValueChange={(value) => setNewTerritory({...newTerritory, responsible_user_id: value})}
                  disabled={createTerritoryMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Asignar responsable (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="population">Población Estimada</Label>
                <Input
                  id="population"
                  type="number"
                  value={newTerritory.population_estimate}
                  onChange={(e) => setNewTerritory({...newTerritory, population_estimate: e.target.value})}
                  placeholder="Ej: 50000"
                  disabled={createTerritoryMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voters">Votantes Estimados</Label>
                <Input
                  id="voters"
                  type="number"
                  value={newTerritory.voter_estimate}
                  onChange={(e) => setNewTerritory({...newTerritory, voter_estimate: e.target.value})}
                  placeholder="Ej: 35000"
                  disabled={createTerritoryMutation.isPending}
                />
              </div>
            </div>

            <Button 
              onClick={handleCreateTerritory} 
              className="w-full"
              disabled={createTerritoryMutation.isPending}
            >
              {createTerritoryMutation.isPending ? "Creando..." : "Crear Territorio"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de territorios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Territorios Registrados ({territories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando territorios...</div>
          ) : (
            <div className="space-y-3">
              {territories.map((territory: any) => {
                const Icon = getTypeIcon(territory.type);
                return (
                  <div key={territory.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{territory.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(territory.type)}>
                            {territory.type.toUpperCase()}
                          </Badge>
                          {territory.parent && (
                            <span className="text-sm text-gray-500">
                              Parte de: {territory.parent.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {territory.population_estimate && (
                          <div>
                            <span className="text-gray-500">Población:</span>
                            <div className="font-medium">{territory.population_estimate.toLocaleString()}</div>
                          </div>
                        )}
                        {territory.voter_estimate && (
                          <div>
                            <span className="text-gray-500">Votantes:</span>
                            <div className="font-medium">{territory.voter_estimate.toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                      {territory.responsible && (
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{territory.responsible.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {territories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay territorios registrados
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TerritoryManager;
