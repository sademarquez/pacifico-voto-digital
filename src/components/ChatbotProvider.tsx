
import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

const ChatbotProvider = () => {
  const { isAuthenticated, user } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Solo mostrar chatbot si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ Chatbot habilitado para usuario:', user.name, user.role);
    } else {
      console.log('❌ Chatbot deshabilitado - usuario no autenticado');
      setIsOpen(false);
      setIsMinimized(true);
    }
  }, [isAuthenticated, user]);

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  // Solo renderizar si el usuario está autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {(isOpen || isMinimized) && (
        <Chatbot
          isMinimized={isMinimized}
          onToggleMinimize={handleToggleMinimize}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ChatbotProvider;
