
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Shield, Crown, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'candidato' | 'votante';
  createdBy: string;
  createdAt: Date;
}

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // Mock users data - in real app this would come from database
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'master@micampaña.com',
      name: 'Usuario Master',
      role: 'master',
      createdBy: 'system',
      createdAt: new Date()
    }
  ]);

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: '' as 'master' | 'candidato' | 'votante' | ''
  });

  const defaultPassword = "micampaña2025";

  const canCreateRole = (targetRole: string) => {
    if (!user) return false;
    
    switch (user.role) {
      case 'master':
        return targetRole === 'candidato';
      case 'candidato':
        return targetRole === 'votante';
      default:
        return false;
    }
  };

  const getAvailableRoles = () => {
    if (!user) return [];
    
    switch (user.role) {
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

    // Check if email already exists
    const emailExists = users.some(u => u.email === newUser.email);
    if (emailExists) {
      toast({
        title: "Error",
        description: "El email ya está registrado",
        variant: "destructive"
      });
      return;
    }

    const user_new: User = {
      id: Date.now().toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as 'master' | 'candidato' | 'votante',
      createdBy: user?.email || 'unknown',
      createdAt: new Date()
    };

    setUsers([...users, user_new]);
    setNewUser({ email: '', name: '', role: '' });

    toast({
      title: "Usuario creado",
      description: `${user_new.name} ha sido creado exitosamente con la contraseña: ${defaultPassword}`,
    });
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
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Ingrese el nombre completo"
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
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as any})}>
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

          <Button onClick={handleCreateUser} className="w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Usuario
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
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
