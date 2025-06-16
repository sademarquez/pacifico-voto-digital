
import { ReactNode } from 'react';

interface ChatbotProviderProps {
  children: ReactNode;
}

// Componente simplificado que solo pasa los children
const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  return <>{children}</>;
};

export default ChatbotProvider;
