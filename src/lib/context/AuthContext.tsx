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

const logAuditEvent = (firestore: any, type: string, userCarnet: string, userId: string, message: string, details: object = {}) => {
  const logEntry = {
      type,
      userCarnet,
      userId,
      message,
      details,
      timestamp: new Date().toISOString(), // Use client time for simplicity here
  };
  const logRef = doc(collection(firestore, 'logs'));

  // Use a non-blocking setDoc and catch permission errors
  setDoc(logRef, logEntry).catch(error => {
      const contextualError = new FirestorePermissionError({
          path: logRef.path,
          operation: 'create',
          requestResourceData: logEntry,
      });
      errorEmitter.emit('permission-error', contextualError);
  });
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioAplicacion | null>(null);
  const [allUsers, setAllUsers] = useState<UsuarioAplicacion[]>([]);
  const [pais, setPaisState] = useState<Pais>('NI');
  const [loading, setLoading] = useState(true);
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
            // Fallback to find user in our fetched list
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

  const login = async (carnet: string, password: string) => {
    const lowerCaseCarnet = carnet.toLowerCase();
    
    // Find user from the comprehensive list fetched from Firestore
    let user = allUsers.find(u => u.carnet.toLowerCase() === lowerCaseCarnet);
    
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: "El carnet ingresado no fue encontrado. Por favor, verifique e intente de nuevo.",
        });
        return;
    }
    
    const userForLogin = user;

    const performLogin = async (authedUser: User) => {
        const userWithCountry = { ...userForLogin, pais };
        setUsuarioActual(userWithCountry);
        localStorage.setItem('usuarioActual', JSON.stringify(userWithCountry));
        logAuditEvent(firestore, 'LOGIN_SUCCESS', carnet, authedUser.uid, `User ${carnet} logged in successfully.`);
        router.push(getDashboardUrl(userForLogin.rol));
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
        await performLogin(userCredential.user);

    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            try {
                // If user doesn't exist in Firebase Auth, create them using the profile from Firestore
                const userCredential = await createUserWithEmailAndPassword(auth, `${lowerCaseCarnet}@corp.local`, password);
                await performLogin(userCredential.user);
            } catch (creationError: any) {
                 toast({
                    variant: "destructive",
                    title: "Error de Registro de Prueba",
                    description: `No se pudo crear la cuenta de prueba: ${creationError.message}`,
                });
            }
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            toast({
                variant: "destructive",
                title: "Error de Autenticación",
                description: "Credenciales incorrectas. Verifique su carnet y contraseña.",
            });
        } else {
            console.error("Firebase login error:", error);
            toast({
                variant: "destructive",
                title: "Error Inesperado",
                description: "Ocurrió un error al intentar iniciar sesión.",
            });
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
        loading: loading,
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
