import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, LogOut, Settings, Crown } from 'lucide-react';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const { user, logout } = useSimpleAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/simple-login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-md">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-600 capitalize">
              <Crown className="w-4 h-4 inline-block mr-1" />
              {user?.role}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-50"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHeader;
