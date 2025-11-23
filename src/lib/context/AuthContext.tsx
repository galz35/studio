"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (carnet: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, user: firebaseUser, isUserLoading } = useFirebase();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(isUserLoading);
  }, [isUserLoading]);

  const login = async (carnet: string) => {
    setLoading(true);
    const email = `${carnet.toLowerCase()}@corp.local`;
    // Hardcoded password for testing purposes
    const password = "password"; 
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection will be handled by the page after successful login
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          // If user doesn't exist, create it for testing purposes
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (creationError: any) {
          toast({
            variant: "destructive",
            title: "Error de Registro de Prueba",
            description: `No se pudo crear la cuenta de prueba: ${creationError.message}`,
          });
        }
      } else {
        console.error("Firebase login error:", error);
        toast({
          variant: "destructive",
          title: "Error Inesperado",
          description: "Ocurrió un error al intentar iniciar sesión.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cerrar la sesión.",
        });
    } finally {
       setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user: firebaseUser, 
        loading,
        login, 
        logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
