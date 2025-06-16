
import PageLayout from "@/components/PageLayout";
import CompleteSystemAudit from "@/components/CompleteSystemAudit";
import { SystemHealthIndicator } from "@/components/SystemHealthIndicator";

const CompleteSystemAuditPage = () => {
  return (
    <PageLayout 
      borderVariant="gradient" 
      borderColor="purple"
      className="bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50"
    >
      <SystemHealthIndicator />
      
      <div className="container mx-auto p-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🚀 Sistema MI CAMPAÑA 2025 Premium
          </h1>
          <p className="text-gray-600 text-lg">
            Auditoría completa, configuración de APIs y acceso total al sistema electoral
          </p>
        </div>
        
        <CompleteSystemAudit />
      </div>
    </PageLayout>
  );
};

export default CompleteSystemAuditPage;
