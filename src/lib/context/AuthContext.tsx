"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UsuarioAplicacion, Rol, Pais } from '@/lib/types/domain';
import { usuarios as mockUsuarios } from '@/lib/mock/usuarios.mock';
import { empleadosEmp2024 } from '@/lib/mock/empleadosEmp2024.mock';

interface AuthContextType {
  usuarioActual: UsuarioAplicacion | null;
  isAuthenticated: boolean;
  loading: boolean;
  pais: Pais;
  setPais: (pais: Pais) => void;
  loginFake: (carnet: string) => void;
  logout: () => void;
  switchRole: (newRole: Rol) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDashboardUrl = (rol: Rol) => {
  switch (rol) {
    case 'PACIENTE':
      return '/paciente/dashboard';
    case 'MEDICO':
      return '/medico/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioAplicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [pais, setPaisState] = useState<Pais>('NI');
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('usuarioActual');
      const storedPais = localStorage.getItem('pais') as Pais;
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUsuarioActual(user);
        if (storedPais) {
          setPaisState(storedPais);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('usuarioActual');
    } finally {
      setLoading(false);
    }
  }, []);

  const setPais = (newPais: Pais) => {
    setPaisState(newPais);
    localStorage.setItem('pais', newPais);
    if(usuarioActual){
        const updatedUser = {...usuarioActual, pais: newPais};
        setUsuarioActual(updatedUser);
        localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));
    }
  };

  const loginFake = (carnet: string) => {
    // Find the first matching user profile for the given carnet
    let user = mockUsuarios.find(u => u.carnet.toLowerCase() === carnet.toLowerCase());
    
    if (!user) {
        console.error("Carnet no encontrado en la base de datos de usuarios.");
        // Ideally show a toast error here
        return;
    }
    
    const userWithCountry = { ...user, pais };
    setUsuarioActual(userWithCountry);
    localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
    router.push(getDashboardUrl(user.rol));
  };

  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActual');
    router.push('/login');
  };
  
  const switchRole = (newRole: Rol) => {
    if (usuarioActual) {
        const baseUser = mockUsuarios.find(u => u.carnet === usuarioActual.carnet && u.rol === newRole);
        if(baseUser){
            const userWithCountry = { ...baseUser, pais };
            setUsuarioActual(userWithCountry);
            localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
            router.push(getDashboardUrl(newRole));
        } else {
            // If the user doesn't have a pre-defined profile for that role, create a temporary one
            const tempUser: UsuarioAplicacion = {
                ...usuarioActual,
                rol: newRole,
                idMedico: newRole === 'MEDICO' ? usuarioActual.idMedico : undefined,
                idPaciente: newRole === 'PACIENTE' ? usuarioActual.idPaciente : undefined,
            };
            setUsuarioActual(tempUser);
            localStorage.setItem('usuarioActual', JSON.stringify(tempUser));
            router.push(getDashboardUrl(newRole));
        }
    }
  };

  return (
    <AuthContext.Provider value={{ 
        usuarioActual, 
        isAuthenticated: !!usuarioActual,
        loading,
        pais,
        setPais,
        loginFake, 
        logout,
        switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
