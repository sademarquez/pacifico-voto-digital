import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, User, Crown } from 'lucide-react';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { useDataSegregation } from '../hooks/useDataSegregation';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const { user } = useSimpleAuth();
  const { canCreateDesarrollador, canCreateMaster, canCreateCandidatos, canCreateLideres, canCreateVotantes, canManageUsers } = useDataSegregation();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'votante'
  });
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editedUser, setEditedUser] = useState({
    id: '',
    name: '',
    role: ''
  });

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && canManageUsers
  });

  // Create user
  const createUserMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error('No Supabase client found');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: newUser.role
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }
      }

      return authData;
    },
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      setIsCreating(false);
      setNewUser({ name: '', email: '', password: '', role: 'votante' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      toast.error(`Error al crear usuario: ${error.message}`);
    }
  });

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !editingUser) throw new Error('No Supabase client or user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: editedUser.name,
          role: editedUser.role
        })
        .eq('id', editingUser.id);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      setEditingUser(null);
      setEditedUser({ id: '', name: '', role: '' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error(`Error al actualizar usuario: ${error.message}`);
    }
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!supabase) throw new Error('No Supabase client found');

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast.error(`Error al eliminar usuario: ${error.message}`);
    }
  });

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    createUserMutation.mutate();
  };

  const handleUpdateUser = async () => {
    if (!editedUser.name || !editedUser.role) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    updateUserMutation.mutate();
  };

  const handleDeleteUser = async (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'bg-red-100 text-red-800';
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'candidato': return 'bg-blue-100 text-blue-800';
      case 'lider': return 'bg-green-100 text-green-800';
      case 'votante': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateRole = (role: string) => {
    switch (role) {
      case 'desarrollador': return canCreateDesarrollador;
      case 'master': return canCreateMaster;
      case 'candidato': return canCreateCandidatos;
      case 'lider': return canCreateLideres;
      case 'votante': return canCreateVotantes;
      default: return false;
    }
  };

  if (!canManageUsers) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Acceso Denegado
          </h3>
          <p className="text-gray-500">
            No tienes permisos para gestionar usuarios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with create user button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <Button onClick={() => setIsCreating(true)} disabled={!canCreateDesarrollador && !canCreateMaster && !canCreateCandidatos && !canCreateLideres && !canCreateVotantes}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Usuario
        </Button>
      </div>

      {/* Create user form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Crear Nuevo Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre completo"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email del usuario"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {canCreateRole('desarrollador') && <SelectItem value="desarrollador">Desarrollador</SelectItem>}
                  {canCreateRole('master') && <SelectItem value="master">Master</SelectItem>}
                  {canCreateRole('candidato') && <SelectItem value="candidato">Candidato</SelectItem>}
                  {canCreateRole('lider') && <SelectItem value="lider">Lider</SelectItem>}
                  {canCreateRole('votante') && <SelectItem value="votante">Votante</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User list */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userProfile) => (
                    <tr key={userProfile.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {userProfile.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userProfile.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge className={getRoleBadgeColor(userProfile.role)}>{userProfile.role}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingUser(userProfile);
                            setEditedUser({ id: userProfile.id, name: userProfile.name, role: userProfile.role });
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteUser(userProfile.id)}
                          disabled={deleteUserMutation.isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit user form */}
      {editingUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre completo"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={editedUser.role} onValueChange={(value) => setEditedUser({ ...editedUser, role: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {canCreateRole('desarrollador') && <SelectItem value="desarrollador">Desarrollador</SelectItem>}
                  {canCreateRole('master') && <SelectItem value="master">Master</SelectItem>}
                  {canCreateRole('candidato') && <SelectItem value="candidato">Candidato</SelectItem>}
                  {canCreateRole('lider') && <SelectItem value="lider">Lider</SelectItem>}
                  {canCreateRole('votante') && <SelectItem value="votante">Votante</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateUser} disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
