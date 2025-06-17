import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, Settings, Plus, RefreshCw } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserDatabase {
  id: string;
  name: string;
  description: string;
  connection_config: any;
  status: 'configured' | 'connected' | 'syncing' | 'error';
  total_records: number;
  last_sync: string | null;
  created_at: string;
}

const DatabaseManager = () => {
  const { user } = useSimpleAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [newDb, setNewDb] = useState({
    name: '',
    description: '',
    connection_type: 'postgresql',
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: ''
  });

  // Simulación de datos hasta que los tipos se actualicen
  const { data: databases = [], isLoading, refetch } = useQuery({
    queryKey: ['user-databases-demo', user?.id],
    queryFn: async (): Promise<UserDatabase[]> => {
      if (!user?.id) return [];

      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 800));

      // Datos de demostración
      return [
        {
          id: 'db-001',
          name: 'Base Electoral Principal',
          description: 'Base de datos principal con información de votantes',
          connection_config: {
            type: 'postgresql',
            host: 'localhost',
            port: 5432,
            database: 'electoral_db'
          },
          status: 'connected',
          total_records: 15420,
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 'db-002', 
          name: 'Datos de Redes Sociales',
          description: 'Información de engagement y métricas sociales',
          connection_config: {
            type: 'mongodb',
            host: 'cluster0.mongodb.net',
            database: 'social_metrics'
          },
          status: 'syncing',
          total_records: 8750,
          last_sync: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    },
    enabled: !!user?.id
  });

  // Simulación de creación de base de datos
  const createDatabaseMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newDatabase: UserDatabase = {
        id: `db-${Date.now()}`,
        name: newDb.name,
        description: newDb.description,
        connection_config: {
          type: newDb.connection_type,
          host: newDb.host,
          port: parseInt(newDb.port),
          database: newDb.database,
          username: newDb.username
        },
        status: 'configured',
        total_records: 0,
        last_sync: null,
        created_at: new Date().toISOString()
      };

      return newDatabase;
    },
    onSuccess: () => {
      toast({
        title: 'Base de datos configurada',
        description: 'La configuración ha sido guardada exitosamente.',
      });
      setIsCreating(false);
      setNewDb({
        name: '',
        description: '',
        connection_type: 'postgresql',
        host: '',
        port: '5432',
        database: '',
        username: '',
        password: ''
      });
      queryClient.invalidateQueries({ queryKey: ['user-databases-demo'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al configurar base de datos',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleCreateDatabase = () => {
    if (!newDb.name || !newDb.host || !newDb.database) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, completa todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }
    createDatabaseMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      configured: 'bg-gray-100 text-gray-800',
      connected: 'bg-green-100 text-green-800',
      syncing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Bases de Datos</h2>
          <p className="text-gray-600">Configura y sincroniza tus bases de datos externas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowImport(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar Datos
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Base de Datos
          </Button>
        </div>
      </div>

      {/* Lista de bases de datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databases.map((db: UserDatabase) => (
          <Card key={db.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Database className="w-6 h-6 text-blue-600" />
                <Badge className={getStatusBadge(db.status)}>
                  {db.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{db.name}</CardTitle>
              <p className="text-sm text-gray-600">{db.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Registros:</span>
                  <span className="font-medium">{db.total_records?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Última sync:</span>
                  <span className="font-medium">
                    {db.last_sync ? new Date(db.last_sync).toLocaleDateString() : 'Nunca'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Config
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal crear base de datos */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Nueva Base de Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Mi Base de Datos"
                  value={newDb.name}
                  onChange={(e) => setNewDb({ ...newDb, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Base de Datos</Label>
                <Select value={newDb.connection_type} onValueChange={(value) => setNewDb({ ...newDb, connection_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción de la base de datos..."
                value={newDb.description}
                onChange={(e) => setNewDb({ ...newDb, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="host">Host/Servidor *</Label>
                <Input
                  id="host"
                  placeholder="localhost o IP del servidor"
                  value={newDb.host}
                  onChange={(e) => setNewDb({ ...newDb, host: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="port">Puerto</Label>
                <Input
                  id="port"
                  placeholder="5432"
                  value={newDb.port}
                  onChange={(e) => setNewDb({ ...newDb, port: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="database">Base de Datos *</Label>
                <Input
                  id="database"
                  placeholder="nombre_bd"
                  value={newDb.database}
                  onChange={(e) => setNewDb({ ...newDb, database: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="usuario"
                  value={newDb.username}
                  onChange={(e) => setNewDb({ ...newDb, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="contraseña"
                  value={newDb.password}
                  onChange={(e) => setNewDb({ ...newDb, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDatabase} disabled={createDatabaseMutation.isPending}>
                {createDatabaseMutation.isPending ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando bases de datos...</p>
        </div>
      )}

      {/* Estado vacío */}
      {!isLoading && databases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay bases de datos configuradas
            </h3>
            <p className="text-gray-500 mb-4">
              Configura tu primera base de datos para comenzar a importar datos.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />  
              Configurar Primera Base de Datos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseManager;
