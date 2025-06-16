
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Plus, Settings, AlertTriangle } from 'lucide-react';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { useDataSegregation } from '../hooks/useDataSegregation';
import { useToast } from '@/hooks/use-toast';

interface Territory {
  id: string;
  name: string;
  type: 'barrio' | 'departamento' | 'municipio' | 'corregimiento' | 'vereda' | 'sector';
  responsible_user_id: string | null;
  created_by: string | null;
  created_at: string;
}

const TerritoryManager = () => {
  const { user } = useSimpleAuth();
  const { getTerritoryFilter, canCreateTerritory, canManageUsers } = useDataSegregation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showNewTerritory, setShowNewTerritory] = useState(false);
  const [newTerritory, setNewTerritory] = useState({
    name: '',
    type: 'barrio' as const,
    responsible_user_id: user?.id || ''
  });
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  // Fetch territories
  const { data: territories = [], isLoading } = useQuery({
    queryKey: ['territories', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];

      const territoryFilter = getTerritoryFilter();
      let query = supabase.from('territories').select('*').order('created_at', { ascending: false });

      if (territoryFilter && Object.keys(territoryFilter).length > 0) {
        query = query.or(territoryFilter as string);
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

  // Fetch users for assigning territories
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('profiles').select('id, name, role');
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    },
    enabled: canManageUsers
  });

  // Create territory mutation
  const createTerritoryMutation = useMutation({
    mutationFn: async (territoryData: typeof newTerritory) => {
      if (!supabase || !user) {
        throw new Error('No Supabase client or user found');
      }

      const { data, error } = await supabase
        .from('territories')
        .insert({
          name: territoryData.name,
          type: territoryData.type,
          responsible_user_id: territoryData.responsible_user_id,
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
        type: 'barrio' as const,
        responsible_user_id: user?.id || ''
      });
      setShowNewTerritory(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el territorio.",
        variant: "destructive",
      });
    }
  });

  // Update territory mutation
  const updateTerritoryMutation = useMutation({
    mutationFn: async (territoryData: Territory) => {
      if (!supabase) throw new Error('No Supabase client found');

      const { error } = await supabase
        .from('territories')
        .update({
          name: territoryData.name,
          type: territoryData.type,
          responsible_user_id: territoryData.responsible_user_id
        })
        .eq('id', territoryData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Territorio actualizado",
        description: "El territorio ha sido modificado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['territories'] });
      setSelectedTerritory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el territorio.",
        variant: "destructive",
      });
    }
  });

  // Delete territory mutation
  const deleteTerritoryMutation = useMutation({
    mutationFn: async (territoryId: string) => {
      if (!supabase) throw new Error('No Supabase client found');

      const { error } = await supabase
        .from('territories')
        .delete()
        .eq('id', territoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Territorio eliminado",
        description: "El territorio ha sido removido exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['territories'] });
      setSelectedTerritory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el territorio.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTerritory = () => {
    if (!newTerritory.name) {
      toast({
        title: "Error",
        description: "Por favor completa el nombre del territorio",
        variant: "destructive"
      });
      return;
    }
    createTerritoryMutation.mutate(newTerritory);
  };

  const handleUpdateTerritory = () => {
    if (!selectedTerritory) return;
    updateTerritoryMutation.mutate(selectedTerritory);
  };

  const handleDeleteTerritory = () => {
    if (!selectedTerritory) return;
    deleteTerritoryMutation.mutate(selectedTerritory.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Territorios</h2>
          <p className="text-slate-600">Administra las zonas de influencia de la campaña</p>
        </div>
        {canCreateTerritory && (
          <Button
            onClick={() => setShowNewTerritory(true)}
            className="bg-slate-600 hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Territorio
          </Button>
        )}
      </div>

      {showNewTerritory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Nuevo Territorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Nombre del Territorio</Label>
              <Input
                placeholder="Nombre descriptivo del territorio..."
                value={newTerritory.name}
                onChange={(e) => setNewTerritory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Tipo de Territorio</Label>
              <Select 
                value={newTerritory.type} 
                onValueChange={(value: any) => setNewTerritory(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barrio">Barrio</SelectItem>
                  <SelectItem value="municipio">Municipio</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="corregimiento">Corregimiento</SelectItem>
                  <SelectItem value="vereda">Vereda</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canManageUsers && (
              <div>
                <Label className="block text-sm font-medium mb-2">Responsable del Territorio</Label>
                <Select 
                  value={newTerritory.responsible_user_id} 
                  onValueChange={(value) => setNewTerritory(prev => ({ ...prev, responsible_user_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un responsable..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowNewTerritory(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTerritory}
                className="bg-slate-600 hover:bg-slate-700"
                disabled={createTerritoryMutation.isPending}
              >
                {createTerritoryMutation.isPending ? "Creando..." : "Crear Territorio"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Territorios Existentes ({territories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando territorios...</div>
          ) : territories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay territorios registrados aún</p>
              <p className="text-sm mt-2">
                Usa el botón "Nuevo Territorio" para empezar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {territories.map((territory) => (
                <Card 
                  key={territory.id} 
                  className={`hover:shadow-md transition-shadow cursor-pointer ${selectedTerritory?.id === territory.id ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setSelectedTerritory(territory)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-800">{territory.name}</h3>
                      {canManageUsers && (
                        <Badge variant="secondary">
                          {users.find(u => u.id === territory.responsible_user_id)?.name || 'Sin Asignar'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      Tipo: {territory.type}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Creado: {new Date(territory.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTerritory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Editar Territorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Nombre del Territorio</Label>
              <Input
                placeholder="Nombre descriptivo del territorio..."
                value={selectedTerritory.name}
                onChange={(e) => setSelectedTerritory(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Tipo de Territorio</Label>
              <Select 
                value={selectedTerritory.type} 
                onValueChange={(value: any) => setSelectedTerritory(prev => prev ? ({ ...prev, type: value }) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barrio">Barrio</SelectItem>
                  <SelectItem value="municipio">Municipio</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="corregimiento">Corregimiento</SelectItem>
                  <SelectItem value="vereda">Vereda</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canManageUsers && (
              <div>
                <Label className="block text-sm font-medium mb-2">Responsable del Territorio</Label>
                <Select 
                  value={selectedTerritory.responsible_user_id || ''} 
                  onValueChange={(value) => setSelectedTerritory(prev => prev ? ({ ...prev, responsible_user_id: value }) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un responsable..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="destructive" 
                onClick={handleDeleteTerritory}
                disabled={deleteTerritoryMutation.isPending}
              >
                {deleteTerritoryMutation.isPending ? "Eliminando..." : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
              <Button 
                onClick={handleUpdateTerritory}
                className="bg-slate-600 hover:bg-slate-700"
                disabled={updateTerritoryMutation.isPending}
              >
                {updateTerritoryMutation.isPending ? "Actualizando..." : "Actualizar Territorio"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TerritoryManager;
