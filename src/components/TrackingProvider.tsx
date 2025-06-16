
import { ReactNode } from 'react';

interface TrackingProviderProps {
  children: ReactNode;
}

// Componente simplificado que solo pasa los children
const TrackingProvider = ({ children }: TrackingProviderProps) => {
  return <>{children}</>;
};

export default TrackingProvider;
