
// Componente simplificado que no renderiza nada en producción
const AppStateDebugger = () => {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#fff',
      border: '1px solid #ccc',
      padding: '8px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      App Debug: OK
    </div>
  );
};

export default AppStateDebugger;
