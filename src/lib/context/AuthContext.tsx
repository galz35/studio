"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { usuarios } from '@/lib/mock';
import { UsuarioAplicacion, Pais, Rol } from '../types/domain';

export interface AuthContextType {
  usuarioActual: UsuarioAplicacion | null;
  loading: boolean;
  pais: Pais;
  setPais: (pais: Pais) => void;
  login: (carnet: string) => Promise<void>;
  logout: () => void;
  switchRole: (rol: Rol) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDashboardUrl = (rol: 'PACIENTE' | 'MEDICO' | 'ADMIN') => {
  switch (rol) {
    case 'PACIENTE': return '/paciente/dashboard';
    case 'MEDICO': return '/medico/dashboard';
    case 'ADMIN': return '/admin/dashboard';
    default: return '/login';
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioAplicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [pais, setPaisState] = useState<Pais>('NI');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('usuarioActual');
    const storedPais = localStorage.getItem('pais') as Pais;
    if (storedUser) {
      setUsuarioActual(JSON.parse(storedUser));
    }
    if (storedPais) {
      setPaisState(storedPais);
    }
    setLoading(false);
  }, []);

  const login = async (carnet: string) => {
    setLoading(true);
    // Find the user to log in from 'usuarios'
    const userToLogin = usuarios.find(u => u.carnet.toLowerCase() === carnet.toLowerCase());

    if (userToLogin) {
        setUsuarioActual(userToLogin);
        setPaisState(userToLogin.pais);
        localStorage.setItem('usuarioActual', JSON.stringify(userToLogin));
        localStorage.setItem('pais', userToLogin.pais);
        router.push(getDashboardUrl(userToLogin.rol));
    } else {
      toast({
        variant: "destructive",
        title: "Error de Autenticación",
        description: "Carnet no encontrado. Por favor, verifique sus credenciales.",
      });
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('pais');
    router.push('/login');
    setLoading(false);
  };
  
  const setPais = (newPais: Pais) => {
      setPaisState(newPais);
      localStorage.setItem('pais', newPais);
  }

  const switchRole = (newRole: Rol) => {
    if (usuarioActual) {
        // Find a user profile that matches the original carnet but has the new role
        const potentialUser = usuarios.find(u => u.carnet === usuarioActual.carnet && u.rol === newRole);
        
        if (potentialUser) {
            setUsuarioActual(potentialUser);
            localStorage.setItem('usuarioActual', JSON.stringify(potentialUser));
            router.push(getDashboardUrl(newRole));
        } else {
            // If no specific user for that role, we create a temporary one for navigation,
            // but this logic might need to be more robust depending on requirements.
            const baseUser = usuarios.find(u => u.carnet === usuarioActual.carnet);
            if (baseUser) {
                 const tempUser: UsuarioAplicacion = {
                    ...baseUser,
                    rol: newRole,
                    // Reset role-specific IDs
                    idPaciente: newRole === 'PACIENTE' ? baseUser.idPaciente : undefined,
                    idMedico: newRole === 'MEDICO' ? baseUser.idMedico : undefined,
                };
                setUsuarioActual(tempUser);
                localStorage.setItem('usuarioActual', JSON.stringify(tempUser));
                router.push(getDashboardUrl(newRole));
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Rol no disponible',
                    description: 'No tiene acceso a este rol.'
                });
            }
        }
    }
  }

  return (
    <AuthContext.Provider value={{ 
        usuarioActual, 
        loading,
        pais,
        setPais,
        login, 
        logout,
        switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
