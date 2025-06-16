
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, Download, Settings, Plus, RefreshCw } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserDatabase {
  id: string;
  name: string;
  description: string;
  connection_config: any;
  status: 'configured' | 'connected' | 'syncing' | 'error';
  total_records: number;
  last_sync: string;
  created_at: string;
}

interface ImportConfig {
  database_id: string;
  import_type: 'csv' | 'excel' | 'database' | 'api';
  file?: File;
  mapping_config: any;
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
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    database_id: '',
    import_type: 'csv',
    mapping_config: {}
  });

  // Fetch user databases with proper error handling
  const { data: databases = [], isLoading, refetch } = useQuery({
    queryKey: ['user-databases', user?.id],
    queryFn: async (): Promise<UserDatabase[]> => {
      if (!user?.id) return [];

      try {
        // Try using the SQL function first
        const { data: functionData, error: functionError } = await supabase
          .rpc('get_user_databases', { p_user_id: user.id });

        if (!functionError && functionData) {
          return functionData;
        }

        // Fallback to direct table query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_databases' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Database query error:', fallbackError);
          return [];
        }
        
        return fallbackData || [];
      } catch (error) {
        console.error('Error fetching databases:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  // Create database mutation
  const createDatabaseMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const connectionConfig = {
        type: newDb.connection_type,
        host: newDb.host,
        port: parseInt(newDb.port),
        database: newDb.database,
        username: newDb.username,
        password: newDb.password // En producción, esto debe ser encriptado
      };

      const { data, error } = await supabase
        .from('user_databases' as any)
        .insert({
          user_id: user.id,
          name: newDb.name,
          description: newDb.description,
          connection_config: connectionConfig,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      queryClient.invalidateQueries({ queryKey: ['user-databases'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al configurar base de datos',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Import data mutation
  const importDataMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !importConfig.database_id) throw new Error('Configuración incompleta');

      const { data, error } = await supabase
        .from('data_imports' as any)
        .insert({
          user_id: user.id,
          database_id: importConfig.database_id,
          import_type: importConfig.import_type,
          file_name: importConfig.file?.name,
          file_size: importConfig.file?.size,
          mapping_config: importConfig.mapping_config,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Importación iniciada',
        description: 'El proceso de importación ha comenzado.',
      });
      setShowImport(false);
      setImportConfig({
        database_id: '',
        import_type: 'csv',
        mapping_config: {}
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error en importación',
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

  const handleImportData = () => {
    if (!importConfig.database_id) {
      toast({
        title: 'Selecciona una base de datos',
        description: 'Debes seleccionar la base de datos destino.',
        variant: 'destructive',
      });
      return;
    }
    importDataMutation.mutate();
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
        {Array.isArray(databases) && databases.map((db: UserDatabase) => (
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

      {/* Modal importar datos */}
      {showImport && (
        <Card>
          <CardHeader>
            <CardTitle>Importar Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-db">Base de Datos Destino</Label>
              <Select value={importConfig.database_id} onValueChange={(value) => setImportConfig({ ...importConfig, database_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una base de datos" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(databases) && databases.map((db: UserDatabase) => (
                    <SelectItem key={db.id} value={db.id}>{db.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="import-type">Tipo de Importación</Label>
              <Select value={importConfig.import_type} onValueChange={(value: any) => setImportConfig({ ...importConfig, import_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">Archivo CSV</SelectItem>
                  <SelectItem value="excel">Archivo Excel</SelectItem>
                  <SelectItem value="database">Base de Datos</SelectItem>
                  <SelectItem value="api">API Externa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {importConfig.import_type === 'csv' || importConfig.import_type === 'excel' ? (
              <div>
                <Label htmlFor="file">Archivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept={importConfig.import_type === 'csv' ? '.csv' : '.xlsx,.xls'}
                  onChange={(e) => setImportConfig({ ...importConfig, file: e.target.files?.[0] })}
                />
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImport(false)}>
                Cancelar
              </Button>
              <Button onClick={handleImportData} disabled={importDataMutation.isPending}>
                {importDataMutation.isPending ? "Procesando..." : "Iniciar Importación"}
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
      {!isLoading && (!databases || (Array.isArray(databases) && databases.length === 0)) && (
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
