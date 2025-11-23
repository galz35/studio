
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import type { UsuarioAplicacion, Rol, Pais } from '@/lib/types/domain';
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

const logAuditEvent = async (firestore: any, type: string, userCarnet: string, userId: string, message: string, details: object = {}) => {
  const logEntry = {
      type,
      userCarnet,
      userId,
      message,
      details,
  };
  
  try {
    const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        // Check for our specific permission error signal from the API
        if (errorBody.message === 'Firestore Permission Error') {
            const permissionError = new FirestorePermissionError({
                path: 'logs',
                operation: 'create',
                requestResourceData: logEntry,
            });
            // Emit the error on the client to be caught by the listener
            errorEmitter.emit('permission-error', permissionError);
        }
        // Throw a generic error to be caught by the outer try/catch
        throw new Error(errorBody.message || 'Log submission failed');
    }
  } catch(error) {
      console.warn("Log submission request failed:", error);
      // Re-throw to be handled by the calling function
      throw error;
  }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioAplicacion | null>(null);
  const [allUsers, setAllUsers] = useState<UsuarioAplicacion[]>([]);
  const [pais, setPaisState] = useState<Pais>('NI');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { auth, firestore, user: firebaseUser, isUserLoading } = useFirebase();

  // Fetch all users from Firestore on initial load
  useEffect(() => {
    if (!firestore) return;
    const fetchAllUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(firestore, 'usuariosAplicacion'));
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UsuarioAplicacion));
            setAllUsers(usersList);
        } catch (error) {
            console.error("Failed to fetch all users:", error);
            const permissionError = new FirestorePermissionError({
                path: 'usuariosAplicacion',
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
    };
    fetchAllUsers();
  }, [firestore]);


  useEffect(() => {
    const internalLoading = isUserLoading || !auth || allUsers.length === 0;
    setLoading(internalLoading);

    if (!internalLoading && firebaseUser) {
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
            const baseUser = allUsers.find(u => u.carnet.toLowerCase() === (firebaseUser.email?.split('@')[0] || ''));
            if(baseUser) {
                setUsuarioActual(baseUser);
                localStorage.setItem('usuarioActual', JSON.stringify(baseUser));
            }
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        logout();
      }
    } else if (!internalLoading && !firebaseUser) {
        setUsuarioActual(null);
        localStorage.removeItem('usuarioActual');
    }
  }, [firebaseUser, isUserLoading, auth, allUsers]);

  const setPais = (newPais: Pais) => {
    setPaisState(newPais);
    localStorage.setItem('pais', newPais);
    if(usuarioActual){
        const updatedUser = {...usuarioActual, pais: newPais};
        setUsuarioActual(updatedUser);
        localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));
    }
  };
  
  const performLogin = async (authedUser: User, userProfile: UsuarioAplicacion) => {
    const userWithCountry = { ...userProfile, pais };
    setUsuarioActual(userWithCountry);
    localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
    
    try {
        await logAuditEvent(firestore, 'LOGIN_SUCCESS', userProfile.carnet, authedUser.uid, `User ${userProfile.carnet} logged in successfully.`);
    } catch(e) {
        // The error is already emitted by logAuditEvent, we just need to stop the loading state.
        setAuthLoading(false);
        // We don't re-toast here as the error boundary will show the issue.
        return; // Stop execution
    }
    
    router.push(getDashboardUrl(userProfile.rol));
    setAuthLoading(false);
  };

  const login = async (carnet: string, password: string) => {
    setAuthLoading(true);
    const lowerCaseCarnet = carnet.toLowerCase();
    const userProfile = allUsers.find(u => u.carnet.toLowerCase() === lowerCaseCarnet);

    if (!userProfile) {
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "El carnet ingresado no fue encontrado.",
        });
        setAuthLoading(false);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
        await performLogin(userCredential.user, userProfile);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            try {
                const newUserCredential = await createUserWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
                await performLogin(newUserCredential.user, userProfile);
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
            // This might catch the error from performLogin if it propagates
            if (!error.message.includes('Log submission failed')) {
                toast({
                    variant: "destructive",
                    title: "Error Inesperado",
                    description: "Ocurrió un error al intentar iniciar sesión.",
                });
            }
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
        const baseUser = allUsers.find(u => u.carnet === usuarioActual.carnet && u.rol === newRole);
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
        loading: loading || authLoading,
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
