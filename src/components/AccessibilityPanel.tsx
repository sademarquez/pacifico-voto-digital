
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  MousePointer, 
  Palette,
  Type,
  RotateCcw,
  Check,
  Settings
} from 'lucide-react';

// Tipos simplificados para el panel
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorTheme: 'default' | 'high-contrast' | 'dark' | 'light';
}

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    voiceControl: false,
    fontSize: 'medium',
    colorTheme: 'default'
  });

  // Función simplificada para actualizar configuraciones
  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función simplificada para anunciar a lectores de pantalla
  const announceToScreenReader = (message: string) => {
    // Implementación básica
    console.log('Accessibility announcement:', message);
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      voiceControl: false,
      fontSize: 'medium',
      colorTheme: 'default'
    });
    announceToScreenReader('Configuraciones de accesibilidad restablecidas');
  };

  const applySettings = () => {
    // Aplicar configuraciones al DOM
    const root = document.documentElement;
    
    // Aplicar contraste alto
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Aplicar texto grande
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Aplicar reducción de movimiento
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    announceToScreenReader('Configuraciones aplicadas exitosamente');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        aria-label="Abrir panel de accesibilidad"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Panel de Accesibilidad
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Personaliza la experiencia según tus necesidades
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Configuraciones visuales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Configuraciones Visuales</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">Contraste Alto</Label>
                  <p className="text-sm text-gray-600">Mejora la visibilidad del texto</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text">Texto Grande</Label>
                  <p className="text-sm text-gray-600">Aumenta el tamaño del texto</p>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduce-motion">Reducir Movimiento</Label>
                  <p className="text-sm text-gray-600">Minimiza animaciones</p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>
            </div>
          </div>

          {/* Configuraciones de navegación */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Navegación</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="keyboard-nav">Navegación por Teclado</Label>
                  <p className="text-sm text-gray-600">Habilita navegación con Tab</p>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="screen-reader">Lector de Pantalla</Label>
                  <p className="text-sm text-gray-600">Optimiza para lectores de pantalla</p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={applySettings} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Aplicar Cambios
            </Button>
            <Button onClick={resetSettings} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
          </div>

          {/* Estado actual */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Estado Actual:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(settings).map(([key, value]) => (
                <Badge
                  key={key}
                  variant={value && value !== 'default' && value !== 'medium' ? "default" : "secondary"}
                  className="text-xs"
                >
                  {key}: {String(value)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPanel;
