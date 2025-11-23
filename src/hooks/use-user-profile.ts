"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { useDoc, useMemoFirebase } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { UsuarioAplicacion, Pais, Rol } from '@/lib/types/domain';
import { useToast } from './use-toast';
import { usuarios } from '@/lib/mock/usuarios.mock';

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


export const useUserProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<Rol | null>(null);
  const [pais, setPaisState] = useState<Pais>('NI');

  // Fetch the user's base profile from Firestore
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // This assumes the user's profile is stored with their Firebase UID as the document ID
    // which is not the case. We will use the mock data for now.
    // This would be doc(firestore, 'usuariosAplicacion', user.uid) in a real scenario
    return null; 
  }, [firestore, user]);

  // For now, we get the profile from mock data.
  const [userProfile, setUserProfile] = useState<UsuarioAplicacion | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const email = user.email;
      if (email) {
        const carnet = email.split('@')[0].toUpperCase();
        // Use the role that was last stored, or default to the first one found
        const storedRole = localStorage.getItem('activeRole') as Rol;
        let profile = usuarios.find(u => u.carnet === carnet && u.rol === storedRole);
        if (!profile) {
            profile = usuarios.find(u => u.carnet === carnet);
        }

        if (profile) {
          setUserProfile(profile);
          setActiveRole(profile.rol);
        }
      }
    }
    setProfileLoading(false);
  }, [user]);


  // Load initial role and country from localStorage
  useEffect(() => {
    const storedPais = localStorage.getItem('pais') as Pais;
    if (storedPais) {
      setPaisState(storedPais);
    }
    const storedRole = localStorage.getItem('activeRole') as Rol;
    if (storedRole) {
      setActiveRole(storedRole);
    }
  }, []);

  const setPais = (newPais: Pais) => {
    setPaisState(newPais);
    localStorage.setItem('pais', newPais);
  };
  
  const switchRole = (newRole: Rol) => {
    if (userProfile) {
        const email = user?.email;
        if(email) {
            const carnet = email.split('@')[0].toUpperCase();
            const newProfile = usuarios.find(u => u.carnet === carnet && u.rol === newRole);
            if (newProfile) {
                setUserProfile(newProfile);
                setActiveRole(newRole);
                localStorage.setItem('activeRole', newRole);
                router.push(getDashboardUrl(newRole));
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Rol no disponible',
                    description: 'No tiene acceso a este rol.'
                })
            }
        }
    }
  };

  return {
    userProfile: userProfile ? { ...userProfile, pais } : null,
    loading: authLoading || profileLoading,
    pais,
    activeRole,
    setPais,
    switchRole,
  };
};
