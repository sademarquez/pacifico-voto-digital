
import PageLayout from "@/components/PageLayout";
import LoginTestChecklist from "@/components/LoginTestChecklist";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";

const LoginTestPage = () => {
  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="blue"
      className="bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <SystemHealthIndicator />
      
      <div className="container mx-auto p-6">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Centro de Testing - Mi Campaña PWA
          </h1>
          <p className="text-gray-600">
            Verificación técnica completa del sistema de autenticación
          </p>
        </div>
        
        <LoginTestChecklist />
      </div>
    </PageLayout>
  );
};

export default LoginTestPage;
