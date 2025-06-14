
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CallToActionLiderazgo = () => {
  return (
    <Card className="bg-gradient-to-r from-slate-600 to-stone-600 text-white mt-8 shadow-3d">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">
          ¿Quieres Ser Parte del Liderazgo?
        </h2>
        <p className="text-lg mb-6 opacity-90 drop-shadow-md">
          Únete a nuestra red de líderes territoriales y ayuda a transformar tu comunidad
        </p>
        <Button size="lg" className="bg-white text-slate-700 hover:bg-gray-100 shadow-3d hover:shadow-3d-hover transition-shadow transform hover:scale-105">
          Solicitar Ser Líder
        </Button>
      </CardContent>
    </Card>
  );
};

export default CallToActionLiderazgo;
