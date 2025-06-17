
import { ReactNode } from 'react';

interface AccessibilityProviderProps {
  children: ReactNode;
}

// Componente simplificado que solo pasa los children sin funcionalidad compleja
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  return <>{children}</>;
}

// Hook simplificado que retorna valores por defecto
export const useAccessibility = () => {
  return {
    settings: {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      voiceControl: false,
      fontSize: 'medium' as const,
      colorTheme: 'default' as const
    },
    updateSetting: () => {},
    announceToScreenReader: () => {},
    isKeyboardUser: false
  };
};

export type { AccessibilityProviderProps };
