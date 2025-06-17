import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import TerritoryManager from "./TerritoryManager";
import UserManagement from "./UserManagement";
import AlertSystem from "./AlertSystem";
import RoleBasedStats from "./RoleBasedStats";
import PersonalizedActions from "./PersonalizedActions";
import QuickActions from "./dashboard/QuickActions";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Zap,
  TestTube,
  Shield,
  Crown,
  Building2,
  Mail,
  Phone,
  Megaphone,
  UserPlus,
  Vote,
  Newspaper,
  Settings,
  FileText,
  Network,
  BarChart3
} from "lucide-react";

const MasterDashboard = () => {
  const { user } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Panel de Control - MI CAMPAÑA 2025
          </h1>
          <p className="text-gray-600">
            Administración centralizada de la campaña electoral
          </p>
        </div>

        <Tabs defaultValue={activeTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="territories">Territorios</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <RoleBasedStats />
            <PersonalizedActions />
            <QuickActions />
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="territories" className="space-y-4">
            <TerritoryManager />
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <AlertSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterDashboard;
