
import InteractiveMapFunnel from '@/components/InteractiveMapFunnel';
import PageLayout from '@/components/PageLayout';

const VisitorFunnelPage = () => {
  return (
    <PageLayout 
      borderVariant="animated" 
      borderColor="purple"
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
    >
      <div className="container mx-auto py-6">
        <InteractiveMapFunnel />
      </div>
    </PageLayout>
  );
};

export default VisitorFunnelPage;
