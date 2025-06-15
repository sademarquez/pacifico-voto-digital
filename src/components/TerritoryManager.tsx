
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Users, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

type TerritoryType = 'departamento' | 'municipio' | 'corregimiento' | 'vereda' | 'barrio' | 'sector';

interface Territory {
  id: string;
  name: string;
  type: TerritoryType;
  parent_id?: string;
  population_estimate?: number;
  voter_estimate?: number;
  created_by?: string;
  responsible_user_id?: string;
  parent?: { name: string };
  responsible?: { name: string };
  children?: { count: number }[];
}

interface ParentTerritory {
  id: string;
  name: string;
  type: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

const TerritoryManager = () => {
  const { user } = useAuth();
  const { getTerritoryFilter, canCreateTerritory } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newTerritory, setNewTerritory] = useState({
    name: '',
    type: '' as TerritoryType | '',
    parent_id: '',
    population_estimate: '',
    voter_estimate: ''
  });

  // Query para obtener territorios filtrados
  const { data: territories = [], isLoading } = useQuery<Territory[]>({
    queryKey: ['territories', user?.id],
    queryFn: async (): Promise<Territory[]> => {
      if (!supabase || !user) return [];
      
      const filter = getTerritoryFilter();
      let query = supabase
        .from('territories')
        .select(`
          *,
          parent:territories!parent_id(name),
          responsible:profiles!responsible_user_id(name),
          children:territories!parent_id(count)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros según el rol
      if (filter && Object.keys(filter).length > 0) {
        if (filter.or) {
          query = query.or(filter.or);
        } else {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== null) {
              query = query.eq(key, value);
            }
          });
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching territories:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener territorios padre disponibles
  const { data: parentTerritories = [] } = useQuery<ParentTerritory[]>({
    queryKey: ['parent-territories', user?.id],
    queryFn: async (): Promise<ParentTerritory[]> => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('territories')
        .select('id, name, type')
        .order('name');

      if (error) {
        console.error('Error fetching parent territories:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener usuarios para responsables
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users-for-territories'],
    queryFn: async (): Promise<User[]> => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase
  });

  // Mutación para crear territorio
  const createTerritoryMutation = useMutation({
    mutationFn: async (territoryData: typeof newTerritory) => {
      if (!supabase || !user || !territoryData.type) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('territories')
        .insert({
          name: territoryData.name,
          type: territoryData.type as TerritoryType,
          parent_id: territoryData.parent_id || null,
          population_estimate: territoryData.population_estimate ? parseInt(territoryData.population_estimate) : null,
          voter_estimate: territoryData.voter_estimate ? parseInt(territoryData.voter_estimate) : null,
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
        description: "El territorio ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['territories'] });
      setNewTerritory({
        name: '',
        type: '',
        parent_id: '',
        population_estimate: '',
        voter_estimate: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el territorio.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTerritory = () => {
    if (!newTerritory.name || !newTerritory.type) {
      toast({
        title: "Error",
        description: "Por favor completa nombre y tipo del territorio",
        variant: "destructive"
      });
      return;
    }
    createTerritoryMutation.mutate(newTerritory);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'departamento': return 'bg-red-100 text-red-800';
      case 'municipio': return 'bg-blue-100 text-blue-800';
      case 'corregimiento': return 'bg-green-100 text-green-800';
      case 'vereda': return 'bg-yellow-100 text-yellow-800';
      case 'barrio': return 'bg-purple-100 text-purple-800';
      case 'sector': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number | null) => {
    if (!num) return 'N/A';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear territorio (solo si tiene permisos) */}
      {canCreateTerritory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Nuevo Territorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Territorio *</Label>
                <Input
                  id="name"
                  value={newTerritory.name}
                  onChange={(e) => setNewTerritory({...newTerritory, name: e.target.value})}
                  placeholder="Nombre del territorio"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Territorio *</Label>
                <Select 
                  value={newTerritory.type} 
                  onValueChange={(value) => setNewTerritory({...newTerritory, type: value as TerritoryType})}
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
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Territorio Padre</Label>
                <Select 
                  value={newTerritory.parent_id} 
                  onValueChange={(value) => setNewTerritory({...newTerritory, parent_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentTerritories.map((territory: any) => (
                      <SelectItem key={territory.id} value={territory.id}>
                        {territory.name} ({territory.type})
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
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voters">Votantes Estimados</Label>
                <Input
                  id="voters"
                  type="number"
                  value={newTerritory.voter_estimate}
                  onChange={(e) => setNewTerritory({...newTerritory, voter_estimate: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <Button 
              onClick={handleCreateTerritory} 
              disabled={createTerritoryMutation.isPending}
              className="w-full"
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
            Territorios Gestionados ({territories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando territorios...</div>
          ) : territories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay territorios asignados
            </div>
          ) : (
            <div className="space-y-4">
              {territories.map((territory) => (
                <div key={territory.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{territory.name}</h3>
                      {territory.parent && (
                        <p className="text-sm text-gray-500">
                          Parte de: {territory.parent.name}
                        </p>
                      )}
                    </div>
                    <Badge className={getTypeColor(territory.type)}>
                      {territory.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        Población: {formatNumber(territory.population_estimate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">
                        Votantes: {formatNumber(territory.voter_estimate)}
                      </span>
                    </div>
                    {territory.responsible && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">
                          Responsable: {territory.responsible.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TerritoryManager;
