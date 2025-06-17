
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accessibility, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const FloatingAccessibilityButton = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false
  });

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Aplicar cambios al DOM
    const root = document.documentElement;
    if (key === 'highContrast') {
      root.classList.toggle('high-contrast', value);
    } else if (key === 'largeText') {
      root.classList.toggle('large-text', value);
    } else if (key === 'reduceMotion') {
      root.classList.toggle('reduce-motion', value);
    }
  };

  return (
    <>
      <Button
        onClick={togglePanel}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 rounded-full shadow-lg z-40 transition-all duration-300 hover:scale-110"
        aria-label="Abrir panel de accesibilidad"
        size="icon"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
      
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-green-600" />
                  Accesibilidad
                </CardTitle>
                <Button
                  onClick={() => setShowPanel(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">Contraste Alto</Label>
                  <p className="text-sm text-gray-600">Mejora la visibilidad</p>
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
                  <p className="text-sm text-gray-600">Aumenta el tamaño</p>
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
                  <p className="text-sm text-gray-600">Menos animaciones</p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingAccessibilityButton;
