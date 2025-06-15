import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Shield, Crown, User, Eye, EyeOff, Loader2, Target, Users2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string | null;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  created_by: string | null;
  created_at: string;
}

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const {
    canCreateCandidatos,
    canCreateLideres,
    canCreateVotantes,
    canManageUsers
  } = useDataSegregation();

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: '' as 'master' | 'candidato' | 'lider' | 'votante' | ''
  });
  
  const defaultPassword = "micampaña2025";

  // Fetch users from Supabase
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔍 Fetching users for role:', currentUser?.role);
      
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching users:", error);
        toast({ title: "Error", description: "No se pudieron cargar los usuarios.", variant: "destructive" });
        return [];
      }
      
      console.log('📋 Users loaded:', data.length);
      return data;
    },
    enabled: canManageUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, name, role }: typeof newUser) => {
      if (!currentUser || !role) throw new Error("Cliente no disponible o rol no seleccionado.");

      console.log('👤 Creating user:', { email, role, createdBy: currentUser.role });

      // 1. Create the user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: defaultPassword,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        throw signUpError;
      }
      if (!signUpData.user) throw new Error("No se pudo crear el usuario.");

      // 2. Update the profile with the correct role and created_by
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role, created_by: currentUser.id })
        .eq('id', signUpData.user.id);

      if (updateError) {
        console.error("❌ Failed to update role:", updateError);
        throw new Error(`El usuario fue creado pero no se pudo asignar el rol. Error: ${updateError.message}`);
      }
      
      console.log('✅ User created successfully:', signUpData.user.email);
      return signUpData.user;
    },
    onSuccess: (createdUser) => {
      toast({
        title: "Usuario creado exitosamente",
        description: `${createdUser.email} ha sido creado con contraseña: ${defaultPassword}`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUser({ email: '', name: '', role: '' });
    },
    onError: (error: any) => {
       toast({
        title: "Error al crear usuario",
        description: error.message || "Ocurrió un error desconocido.",
        variant: "destructive",
      });
    }
  });
  
  const getAvailableRoles = () => {
    if (!currentUser) return [];
    
    const roles = [];
    
    console.log('🔐 Checking permissions for role:', currentUser.role);
    
    // Desarrollador puede crear Masters
    if (currentUser.role === 'desarrollador') {
      roles.push({ value: 'master', label: 'Master', icon: Crown, description: 'Gestiona candidatos y campañas completas' });
    }
    
    // Master puede crear Candidatos
    if (canCreateCandidatos) {
      roles.push({ value: 'candidato', label: 'Candidato', icon: Target, description: 'Gestiona líderes territoriales' });
    }
    
    // Candidato puede crear Líderes
    if (canCreateLideres) {
      roles.push({ value: 'lider', label: 'Líder Territorial', icon: Users2, description: 'Coordina votantes en territorios' });
    }
    
    // Líder puede crear Votantes
    if (canCreateVotantes) {
      roles.push({ value: 'votante', label: 'Votante', icon: User, description: 'Usuario base del sistema' });
    }
    
    console.log('📝 Available roles:', roles.map(r => r.value));
    return roles;
  };

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.name || !newUser.role) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    
    console.log('🚀 Creating user:', newUser);
    createUserMutation.mutate(newUser);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'desarrollador': return Shield;
      case 'master': return Crown;
      case 'candidato': return Target;
      case 'lider': return Users2;
      case 'votante': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'bg-purple-100 text-purple-800';
      case 'master': return 'bg-red-100 text-red-800';
      case 'candidato': return 'bg-blue-100 text-blue-800';
      case 'lider': return 'bg-orange-100 text-orange-800';
      case 'votante': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'Desarrollador';
      case 'master': return 'Master';
      case 'candidato': return 'Candidato';
      case 'lider': return 'Líder Territorial';
      case 'votante': return 'Votante';
      default: return role;
    }
  };

  if (!canManageUsers) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-600">Acceso Restringido</h2>
        <p className="text-gray-500">No tienes permisos para gestionar usuarios.</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Rol actual: <strong>{currentUser?.role}</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Para gestionar usuarios necesitas el rol de: Master, Candidato o Líder
          </p>
        </div>
      </div>
    );
  }

  const availableRoles = getAvailableRoles();

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800">Debug Info</h3>
        <p className="text-sm text-yellow-700">
          Usuario: {currentUser?.name} ({currentUser?.role})
        </p>
        <p className="text-sm text-yellow-700">
          Permisos: Candidatos={canCreateCandidatos.toString()}, Líderes={canCreateLideres.toString()}, Votantes={canCreateVotantes.toString()}
        </p>
        <p className="text-sm text-yellow-700">
          Roles disponibles: {availableRoles.map(r => r.label).join(', ')}
        </p>
      </div>

      {availableRoles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Crear Nuevo Usuario
            </CardTitle>
            <p className="text-sm text-gray-600">
              Como {getRoleDisplayName(currentUser?.role || '')}, puedes crear los siguientes tipos de usuarios:
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Ingrese el nombre completo"
                  disabled={createUserMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@email.com"
                  disabled={createUserMutation.isPending}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value as any})}
                  disabled={createUserMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div>{role.label}</div>
                              <div className="text-xs text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Contraseña por defecto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={defaultPassword}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleCreateUser} className="w-full" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {createUserMutation.isPending ? "Creando usuario..." : "Crear Usuario"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios en el Sistema ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => {
                const Icon = getRoleIcon(user.role);
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{user.name || 'Nombre no disponible'}</h3>
                        <p className="text-sm text-gray-500">
                          {user.id.substring(0,8)}... • Creado: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
