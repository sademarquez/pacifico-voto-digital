
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accessibility } from 'lucide-react';
import AccessibilityPanel from './AccessibilityPanel';

const FloatingAccessibilityButton = () => {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      <Button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300 hover:scale-110"
        aria-label="Abrir panel de accesibilidad"
        size="icon"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
      
      {showPanel && (
        <div className="fixed inset-0 z-50">
          <AccessibilityPanel />
        </div>
      )}
    </>
  );
};

export default FloatingAccessibilityButton;
