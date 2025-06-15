
import { useAuth } from "../contexts/AuthContext";

export const useDataSegregation = () => {
  const { user } = useAuth();

  // Función para obtener territorios según el rol del usuario
  const getTerritoryFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'desarrollador':
      case 'master':
        // Desarrollador y Master ven todos los territorios
        return {};
      case 'candidato':
        // Candidato solo ve territorios donde es responsable o los creó
        return {
          or: `responsible_user_id.eq.${user.id},created_by.eq.${user.id}`
        };
      case 'lider':
        // Líder ve territorios que maneja directamente
        return {
          responsible_user_id: user.id
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
      case 'desarrollador':
      case 'master':
        return {}; // Ve todos
      case 'candidato':
        // Solo votantes en territorios que maneja
        return {
          'territories.responsible_user_id': user.id
        };
      case 'lider':
        // Votantes en su territorio específico
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
      case 'desarrollador':
      case 'master':
        return {}; // Ve todas
      case 'candidato':
      case 'lider':
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

  // Permisos basados en la nueva jerarquía
  const getPermissions = () => {
    if (!user) return {
      canCreateTerritory: false,
      canManageUsers: false,
      canViewAllData: false,
      canCreateCandidatos: false,
      canCreateLideres: false,
      canCreateVotantes: false
    };

    switch (user.role) {
      case 'desarrollador':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: true,
          canCreateCandidatos: true,
          canCreateLideres: true,
          canCreateVotantes: true
        };
      case 'master':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: true,
          canCreateCandidatos: true,
          canCreateLideres: false,
          canCreateVotantes: false
        };
      case 'candidato':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: false,
          canCreateCandidatos: false,
          canCreateLideres: true,
          canCreateVotantes: false
        };
      case 'lider':
        return {
          canCreateTerritory: false,
          canManageUsers: true,
          canViewAllData: false,
          canCreateCandidatos: false,
          canCreateLideres: false,
          canCreateVotantes: true
        };
      case 'votante':
        return {
          canCreateTerritory: false,
          canManageUsers: false,
          canViewAllData: false,
          canCreateCandidatos: false,
          canCreateLideres: false,
          canCreateVotantes: false
        };
      default:
        return {
          canCreateTerritory: false,
          canManageUsers: false,
          canViewAllData: false,
          canCreateCandidatos: false,
          canCreateLideres: false,
          canCreateVotantes: false
        };
    }
  };

  return {
    getTerritoryFilter,
    getVoterFilter,
    getAlertFilter,
    getPermissions,
    ...getPermissions()
  };
};
