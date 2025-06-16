import Navigation from "../components/Navigation";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";
import TaskManager from "../components/dashboard/TaskManager";

const TasksPage = () => {
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
            Mis Tareas
          </h1>
          <p className="text-gray-600">
            Gestiona tus tareas y contribuye al éxito de la campaña
          </p>
        </div>
        <TaskManager />
      </div>
    </div>
  );
};

export default TasksPage;
