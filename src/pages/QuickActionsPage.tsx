import Navigation from "../components/Navigation";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import QuickActions from "../components/dashboard/QuickActions";

const QuickActionsPage = () => {
  const { user } = useSimpleAuth();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Acciones Rápidas
          </h1>
          <p className="text-gray-600">
            Herramientas esenciales para tu rol en la campaña
          </p>
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

export default QuickActionsPage;
