"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword } from 'firebase/auth';

import type { UsuarioAplicacion, Rol, Pais } from '@/lib/types/domain';
import { usuarios as mockUsuarios } from '@/lib/mock/usuarios.mock';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';

interface AuthContextType {
  usuarioActual: UsuarioAplicacion | null;
  isAuthenticated: boolean;
  loading: boolean;
  pais: Pais;
  setPais: (pais: Pais) => void;
  login: (carnet: string, password: string) => void;
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
  const [pais, setPaisState] = useState<Pais>('NI');
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user: firebaseUser, isUserLoading } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && firebaseUser) {
      try {
        const storedUser = localStorage.getItem('usuarioActual');
        const storedPais = localStorage.getItem('pais') as Pais;
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsuarioActual(user);
          if (storedPais) {
            setPaisState(storedPais);
          }
        } else {
            // This might happen if user is logged in to Firebase but localStorage is cleared
            // We find the base user from mocks and set it.
            const baseUser = mockUsuarios.find(u => u.carnet.startsWith(firebaseUser.uid || ''));
            if(baseUser) {
                setUsuarioActual(baseUser);
                localStorage.setItem('usuarioActual', JSON.stringify(baseUser));
            }
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        logout();
      }
    } else if (!isUserLoading && !firebaseUser) {
        setUsuarioActual(null);
        localStorage.removeItem('usuarioActual');
    }
  }, [firebaseUser, isUserLoading]);

  const setPais = (newPais: Pais) => {
    setPaisState(newPais);
    localStorage.setItem('pais', newPais);
    if(usuarioActual){
        const updatedUser = {...usuarioActual, pais: newPais};
        setUsuarioActual(updatedUser);
        localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));
    }
  };

  const login = async (carnet: string, password: string) => {
    let user = mockUsuarios.find(u => u.carnet.toLowerCase() === carnet.toLowerCase());
    
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "El carnet ingresado no fue encontrado. Por favor, verifique e intente de nuevo.",
        });
        return;
    }
    
    try {
        // We use the carnet as the email username for this mock login
        await signInWithEmailAndPassword(auth, `${carnet.toLowerCase()}@corp.local`, password);
        
        const userWithCountry = { ...user, pais };
        setUsuarioActual(userWithCountry);
        localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
        router.push(getDashboardUrl(user.rol));

    } catch (error: any) {
        console.error("Firebase login error:", error);
         toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "Credenciales incorrectas. Verifique su carnet y contraseña.",
        });
    }
  };

  const logout = () => {
    auth.signOut();
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('pais');
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
            toast({
                variant: 'destructive',
                title: 'Rol no disponible',
                description: 'No tiene acceso a este rol.'
            })
        }
    }
  };

  return (
    <AuthContext.Provider value={{ 
        usuarioActual, 
        isAuthenticated: !!firebaseUser && !!usuarioActual,
        loading: isUserLoading,
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
