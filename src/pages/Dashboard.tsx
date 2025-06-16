import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navigation from "../components/Navigation";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import FloatingAccessibilityButton from "../components/FloatingAccessibilityButton";
import RoleBasedStats from "../components/RoleBasedStats";
import PersonalizedActions from "../components/PersonalizedActions";
import DashboardVisitante from "../components/DashboardVisitante";
import DashboardVotante from "../components/DashboardVotante";
import MasterDashboard from "../components/MasterDashboard";
import ElectoralDashboard from "../components/ElectoralDashboard";
import QuickActions from "../components/dashboard/QuickActions";
import ChatbotManager from "../components/ChatbotManager";

const Dashboard = () => {
  const { user } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState("general");

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Renderizar diferente contenido según el rol
  if (user.role === 'visitante') {
    return <DashboardVisitante />;
  }

  if (user.role === 'votante') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <DashboardVotante />
        </div>
        <FloatingAccessibilityButton />
        <ChatbotManager />
      </div>
    );
  }

  if (user.role === 'master') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <MasterDashboard />
        </div>
        <FloatingAccessibilityButton />
        <ChatbotManager />
      </div>
    );
  }

  if (user.role === 'desarrollador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <MasterDashboard />
        </div>
        <FloatingAccessibilityButton />
        <ChatbotManager />
      </div>
    );
  }

  if (user.role === 'candidato') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <ElectoralDashboard />
        </div>
        <FloatingAccessibilityButton />
        <ChatbotManager />
      </div>
    );
  }

  if (user.role === 'lider') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <ElectoralDashboard />
        </div>
        <FloatingAccessibilityButton />
        <ChatbotManager />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rol no reconocido</p>
          </CardContent>
        </Card>
      </div>
      <FloatingAccessibilityButton />
      <ChatbotManager />
    </div>
  );
};

export default Dashboard;
