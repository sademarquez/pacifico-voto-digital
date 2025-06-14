
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, Users } from "lucide-react";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    email: "",
    municipio: "",
    barrioVereda: "",
    liderReferenteID: "",
    motivacion: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const municipios = [
    "Buenaventura",
    "Tumaco",
    "Quibdó",
    "Guapi",
    "Timbiquí",
    "López de Micay",
    "Nuquí",
    "Bahía Solano"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica para enviar los datos a Google Sheets
      console.log("Datos del formulario:", formData);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "¡Registro Exitoso!",
        description: "Bienvenido a Mi Campaña. Pronto un líder territorial se pondrá en contacto contigo.",
      });

      // Resetear formulario
      setFormData({
        nombreCompleto: "",
        telefono: "",
        email: "",
        municipio: "",
        barrioVereda: "",
        liderReferenteID: "",
        motivacion: ""
      });
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "Por favor intenta nuevamente o contacta a nuestro equipo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Únete a Mi Campaña
            </h1>
            <p className="text-lg text-gray-600">
              Forma parte de la red de líderes que está transformando el Pacífico colombiano
            </p>
          </div>

          {/* Registration Form */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <User className="w-6 h-6 mr-2" />
                Formulario de Registro
              </CardTitle>
              <CardDescription className="text-blue-100">
                Todos los campos marcados con * son obligatorios
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Información Personal
                  </h3>
                  
                  <div>
                    <Label htmlFor="nombreCompleto" className="text-base font-medium">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="nombreCompleto"
                      type="text"
                      value={formData.nombreCompleto}
                      onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefono" className="text-base font-medium">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Teléfono WhatsApp *
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+57 300 123 4567"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-medium">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email (opcional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Territorial */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Información Territorial
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="municipio" className="text-base font-medium">
                        Municipio *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("municipio", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecciona tu municipio" />
                        </SelectTrigger>
                        <SelectContent>
                          {municipios.map((municipio) => (
                            <SelectItem key={municipio} value={municipio}>
                              {municipio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="barrioVereda" className="text-base font-medium">
                        Barrio/Vereda *
                      </Label>
                      <Input
                        id="barrioVereda"
                        type="text"
                        value={formData.barrioVereda}
                        onChange={(e) => handleInputChange("barrioVereda", e.target.value)}
                        placeholder="Nombre de tu barrio o vereda"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Referencia y Motivación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    <Users className="w-5 h-5 inline mr-2" />
                    Información Adicional
                  </h3>
                  
                  <div>
                    <Label htmlFor="liderReferenteID" className="text-base font-medium">
                      ID del Líder que te Refirió (opcional)
                    </Label>
                    <Input
                      id="liderReferenteID"
                      type="text"
                      value={formData.liderReferenteID}
                      onChange={(e) => handleInputChange("liderReferenteID", e.target.value)}
                      placeholder="Ej: LID001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivacion" className="text-base font-medium">
                      ¿Por qué te quieres unir a Mi Campaña?
                    </Label>
                    <Textarea
                      id="motivacion"
                      value={formData.motivacion}
                      onChange={(e) => handleInputChange("motivacion", e.target.value)}
                      placeholder="Cuéntanos qué te motiva a participar en este proyecto..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? "Registrando..." : "Unirme a la Campaña"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                ¿Qué sucede después del registro?
              </h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Recibirás una confirmación por WhatsApp</li>
                <li>• Un líder territorial de tu zona se pondrá en contacto</li>
                <li>• Tendrás acceso a herramientas exclusivas de la plataforma</li>
                <li>• Podrás participar en actividades y eventos locales</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Registro;
