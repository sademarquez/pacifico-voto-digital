
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Shield, Crown, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// This type now represents the data from our 'profiles' table
interface Profile {
  id: string;
  name: string | null;
  role: 'master' | 'candidato' | 'votante';
  created_by: string | null;
  created_at: string;
}

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: '' as 'master' | 'candidato' | 'votante' | ''
  });
  
  const defaultPassword = "micampaña2025";

  // Fetch users from Supabase
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<Profile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error("Error fetching users:", error);
        toast({ title: "Error", description: "No se pudieron cargar los usuarios.", variant: "destructive" });
        return [];
      }
      return data;
    },
    enabled: !!supabase,
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ email, name, role }: typeof newUser) => {
      if (!supabase || !currentUser || !role) throw new Error("Cliente no disponible o rol no seleccionado.");

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

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("No se pudo crear el usuario.");

      // 2. Update the profile with the correct role and created_by
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role, created_by: currentUser.id })
        .eq('id', signUpData.user.id);

      if (updateError) {
        // Here you might want to handle rollback logic, e.g., delete the auth user
        console.error("Failed to update role, user created but with default role 'votante'", updateError);
        throw new Error(`El usuario fue creado pero no se pudo asignar el rol. Por favor, actualícelo manualmente. Error: ${updateError.message}`);
      }
      
      return signUpData.user;
    },
    onSuccess: (createdUser) => {
      toast({
        title: "Usuario creado",
        description: `El usuario para ${createdUser.email} ha sido creado con la contraseña por defecto.`,
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
  
  const canCreateRole = (targetRole: string) => {
    if (!currentUser) return false;
    
    switch (currentUser.role) {
      case 'master':
        return targetRole === 'candidato';
      case 'candidato':
        return targetRole === 'votante';
      default:
        return false;
    }
  };

  const getAvailableRoles = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'master':
        return [{ value: 'candidato', label: 'Candidato', icon: Crown }];
      case 'candidato':
        return [{ value: 'votante', label: 'Votante', icon: User }];
      default:
        return [];
    }
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

    if (!canCreateRole(newUser.role)) {
      toast({
        title: "Error",
        description: "No tienes permisos para crear este tipo de usuario",
        variant: "destructive"
      });
      return;
    }
    
    createUserMutation.mutate(newUser);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'master': return Shield;
      case 'candidato': return Crown;
      case 'votante': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master': return 'bg-red-100 text-red-800';
      case 'candidato': return 'bg-blue-100 text-blue-800';
      case 'votante': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Crear Nuevo Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
                  {getAvailableRoles().map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {role.label}
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

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios Registrados ({users.length})
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
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name || 'Nombre no disponible'}</h3>
                        <p className="text-sm text-gray-500">ID: {user.id.substring(0,8)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
