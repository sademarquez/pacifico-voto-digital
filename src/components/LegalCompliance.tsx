
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Lock,
  Eye,
  UserCheck,
  Database,
  Globe,
  Scale
} from 'lucide-react';

const LegalCompliance = () => {
  const complianceItems = [
    {
      category: 'Protección de Datos',
      items: [
        { name: 'GDPR - Reglamento General de Protección de Datos', status: 'compliant', priority: 'high' },
        { name: 'Ley 1581 de 2012 - Protección de Datos Personales Colombia', status: 'compliant', priority: 'high' },
        { name: 'Decreto 1377 de 2013 - Reglamentario Protección de Datos', status: 'compliant', priority: 'high' },
        { name: 'Consentimiento Informado para Tratamiento de Datos', status: 'compliant', priority: 'medium' }
      ],
      icon: Lock
    },
    {
      category: 'Normativa Electoral',
      items: [
        { name: 'Código Electoral Colombiano - Ley 1475 de 2011', status: 'compliant', priority: 'high' },
        { name: 'Ley 996 de 2005 - Garantías Electorales', status: 'compliant', priority: 'high' },
        { name: 'Resolución 0654 de 2022 - Propaganda Electoral Digital', status: 'compliant', priority: 'medium' },
        { name: 'Transparencia en Financiación de Campañas', status: 'review', priority: 'medium' }
      ],
      icon: Scale
    },
    {
      category: 'Comunicaciones y Marketing',
      items: [
        { name: 'Ley 1480 de 2011 - Estatuto del Consumidor', status: 'compliant', priority: 'medium' },
        { name: 'Decreto 1074 de 2015 - Comunicaciones Comerciales', status: 'compliant', priority: 'low' },
        { name: 'Políticas WhatsApp Business API', status: 'compliant', priority: 'medium' },
        { name: 'Anti-Spam y Comunicaciones No Solicitadas', status: 'compliant', priority: 'high' }
      ],
      icon: Globe
    },
    {
      category: 'Tecnología y Seguridad',
      items: [
        { name: 'Ley 1273 de 2009 - Delitos Informáticos', status: 'compliant', priority: 'high' },
        { name: 'ISO 27001 - Gestión de Seguridad de la Información', status: 'review', priority: 'medium' },
        { name: 'Encriptación de Datos Sensibles', status: 'compliant', priority: 'high' },
        { name: 'Auditorías de Seguridad Regulares', status: 'scheduled', priority: 'medium' }
      ],
      icon: Shield
    }
  ];

  const legalDocuments = [
    { name: 'Política de Privacidad', status: 'updated', date: '2025-01-15' },
    { name: 'Términos y Condiciones de Uso', status: 'updated', date: '2025-01-15' },
    { name: 'Política de Tratamiento de Datos', status: 'updated', date: '2025-01-15' },
    { name: 'Aviso de Privacidad WhatsApp', status: 'updated', date: '2025-01-15' },
    { name: 'Consentimientos Informados', status: 'updated', date: '2025-01-15' },
    { name: 'Manual de Transparencia Electoral', status: 'draft', date: '2025-01-10' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'review': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'scheduled': return <Eye className="w-4 h-4 text-blue-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <Badge className="bg-green-100 text-green-800">Cumple</Badge>;
      case 'review': return <Badge className="bg-yellow-100 text-yellow-800">Revisión</Badge>;
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-800">Programado</Badge>;
      case 'updated': return <Badge className="bg-green-100 text-green-800">Actualizado</Badge>;
      case 'draft': return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>;
      default: return <Badge className="bg-red-100 text-red-800">Pendiente</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Legal */}
      <Card className="elegant-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Cumplimiento Legal y Normativo</CardTitle>
              <p className="text-gray-600 mt-1">
                Sistema MI CAMPAÑA 2025 - Certificación de Cumplimiento Integral
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">89%</div>
              <div className="text-sm text-green-600">Cumplimiento</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">A+</div>
              <div className="text-sm text-blue-600">Seguridad</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">18</div>
              <div className="text-sm text-purple-600">Normativas</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-800">100%</div>
              <div className="text-sm text-emerald-600">Transparencia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorías de Cumplimiento */}
      {complianceItems.map((category, index) => {
        const Icon = category.icon;
        return (
          <Card key={index} className="elegant-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-600" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className={`p-4 border-l-4 ${getPriorityColor(item.priority)} bg-gray-50 rounded-r-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            item.priority === 'high' ? 'border-red-300 text-red-700' :
                            item.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-green-300 text-green-700'
                          }`}
                        >
                          {item.priority === 'high' ? 'Alta' : 
                           item.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Documentos Legales */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documentación Legal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {legalDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{doc.name}</div>
                    <div className="text-sm text-gray-500">Última actualización: {doc.date}</div>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Recomendadas */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Acciones Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Auditoria ISO 27001 Pendiente</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Se recomienda programar auditoría de seguridad de la información para certificación ISO 27001.
                  </p>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Programar Auditoría
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Revisión de Transparencia Electoral</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Revisar cumplimiento de nuevas normativas de transparencia en financiación electoral.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Iniciar Revisión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificaciones */}
      <Card className="elegant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Certificaciones y Sellos de Calidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">GDPR</div>
              <div className="text-xs text-green-600">Certificado</div>
            </div>
            <div className="text-center p-4 border border-blue-200 rounded-lg">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">SSL A+</div>
              <div className="text-xs text-blue-600">Seguridad</div>
            </div>
            <div className="text-center p-4 border border-purple-200 rounded-lg">
              <Database className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800">SOC 2</div>
              <div className="text-xs text-purple-600">En Proceso</div>
            </div>
            <div className="text-center p-4 border border-emerald-200 rounded-lg">
              <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <div className="font-semibold text-emerald-800">WCAG 2.1</div>
              <div className="text-xs text-emerald-600">Accesibilidad</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalCompliance;
