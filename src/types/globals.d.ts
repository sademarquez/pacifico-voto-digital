
// Declaraciones de tipos globales para MI CAMPAÑA 2025

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: any) => void;
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

export {};
