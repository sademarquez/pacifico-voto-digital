
import PageLayout from '@/components/PageLayout';
import MobileAppAudit from '@/components/MobileAppAudit';

const MobileAuditPage = () => {
  return (
    <PageLayout 
      borderVariant="animated" 
      borderColor="blue"
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      <div className="container mx-auto py-6">
        <MobileAppAudit />
      </div>
    </PageLayout>
  );
};

export default MobileAuditPage;
