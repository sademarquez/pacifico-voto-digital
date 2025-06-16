
import PageLayout from "@/components/PageLayout";
import SystemAudit from "@/components/SystemAudit";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";

const SystemAuditPage = () => {
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
            🔍 Auditoría Completa del Sistema
          </h1>
          <p className="text-gray-600">
            Verificación técnica de autenticación, APIs y funcionalidades
          </p>
        </div>
        
        <SystemAudit />
      </div>
    </PageLayout>
  );
};

export default SystemAuditPage;
