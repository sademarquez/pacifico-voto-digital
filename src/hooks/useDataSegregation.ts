
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useDataSegregation = () => {
  const { user } = useAuth();

  // Función para obtener territorios según el rol del usuario
  const getTerritoryFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'master':
        // Master ve todos los territorios
        return {};
      case 'candidato':
        // Candidato solo ve territorios donde es responsable o los creó
        return {
          or: `responsible_user_id.eq.${user.id},created_by.eq.${user.id}`
        };
      case 'votante':
        // Votante solo ve información básica de su territorio
        return {
          responsible_user_id: user.id
        };
      default:
        return { id: 'null' }; // No acceso
    }
  };

  // Función para obtener filtro de votantes
  const getVoterFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'master':
        return {}; // Ve todos
      case 'candidato':
        // Solo votantes en territorios que maneja
        return {
          'territories.responsible_user_id': user.id
        };
      case 'votante':
        // Solo votantes que él registró
        return {
          registered_by: user.id
        };
      default:
        return { id: 'null' };
    }
  };

  // Función para obtener filtro de alertas
  const getAlertFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'master':
        return {}; // Ve todas
      case 'candidato':
        return {
          or: `created_by.eq.${user.id},affected_user_id.eq.${user.id}`
        };
      case 'votante':
        return {
          affected_user_id: user.id
        };
      default:
        return { id: 'null' };
    }
  };

  return {
    getTerritoryFilter,
    getVoterFilter,
    getAlertFilter,
    canCreateTerritory: user?.role === 'master' || user?.role === 'candidato',
    canManageUsers: user?.role === 'master' || user?.role === 'candidato',
    canViewAllData: user?.role === 'master'
  };
};
