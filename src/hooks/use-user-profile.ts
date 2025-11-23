"use client";

import { useAuth } from './use-auth';
import { UsuarioAplicacion, Pais, Rol } from '@/lib/types/domain';

export const useUserProfile = () => {
  const { usuarioActual, loading, pais, setPais, switchRole } = useAuth();

  return {
    userProfile: usuarioActual,
    loading,
    pais,
    setPais,
    switchRole,
    // Deprecated, use userProfile directly
    id: usuarioActual?.id,
    idPaciente: usuarioActual?.idPaciente,
    idMedico: usuarioActual?.idMedico,
    rol: usuarioActual?.rol,
    nombreCompleto: usuarioActual?.nombreCompleto,
    carnet: usuarioActual?.carnet,
  };
};
