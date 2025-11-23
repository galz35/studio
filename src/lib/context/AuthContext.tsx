
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { auth, user: firebaseUser, isUserLoading } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && firebaseUser) {
      try {
        const storedUser = localStorage.getItem('usuarioActual');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsuarioActual(user);
        }
        const storedPais = localStorage.getItem('pais') as Pais;
        if (storedPais) {
          setPaisState(storedPais);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        logout();
      }
    } else if (!isUserLoading && !firebaseUser) {
      setUsuarioActual(null);
      localStorage.removeItem('usuarioActual');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  
  const performLogin = (authedUser: User, userProfile: UsuarioAplicacion) => {
    const userWithCountry = { ...userProfile, pais };
    setUsuarioActual(userWithCountry);
    localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
    router.push(getDashboardUrl(userProfile.rol));
    setAuthLoading(false);
  };

  const login = async (carnet: string, password: string) => {
    setAuthLoading(true);
    const lowerCaseCarnet = carnet.toLowerCase();
    
    // Find user profile from mock data. This is crucial to avoid Firestore read on login.
    const userProfile = mockUsuarios.find(u => u.carnet.toLowerCase() === lowerCaseCarnet);

    if (!userProfile) {
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "El carnet ingresado no fue encontrado en la lista de usuarios de prueba.",
        });
        setAuthLoading(false);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
        performLogin(userCredential.user, userProfile);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // If user doesn't exist in Firebase Auth, create it for testing purposes
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
                performLogin(newUserCredential.user, userProfile);
            } catch (creationError: any) {
                 toast({
                    variant: "destructive",
                    title: "Error de Registro de Prueba",
                    description: `No se pudo crear la cuenta de prueba: ${creationError.message}`,
                });
                setAuthLoading(false);
            }
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            toast({
                variant: "destructive",
                title: "Error de Autenticación",
                description: "Credenciales incorrectas. Verifique su carnet y contraseña.",
            });
            setAuthLoading(false);
        } else {
            console.error("Firebase login error:", error);
            toast({
                variant: "destructive",
                title: "Error Inesperado",
                description: "Ocurrió un error al intentar iniciar sesión.",
            });
            setAuthLoading(false);
        }
    }
  };

  const logout = () => {
    if(auth) auth.signOut();
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('pais');
    router.push('/login');
  };
  
  const switchRole = (newRole: Rol) => {
    if (usuarioActual) {
        // Find a profile with the same carnet but different role in the mock data
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
        loading: isUserLoading || authLoading,
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
