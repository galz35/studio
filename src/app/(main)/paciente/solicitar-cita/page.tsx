"use client";

import React from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { SolicitudCitaWizard } from '@/components/paciente/SolicitudCitaWizard';
import { useDoc, useMemoFirebase } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { EmpleadoEmp2024 } from '@/lib/types/domain';

export default function SolicitarCitaPage() {
    const { userProfile } = useUserProfile();
    const { firestore } = useFirebase();

    const empleadoRef = useMemoFirebase(() => {
        if (!firestore || !userProfile) return null;
        return doc(firestore, 'empleadosEmp2024', userProfile.carnet);
    }, [firestore, userProfile]);

    const { data: empleado, isLoading } = useDoc<EmpleadoEmp2024>(empleadoRef);

    if (isLoading) return <div>Cargando datos del empleado...</div>

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Chequeo de Bienestar / Solicitud de Cita</h1>
                {empleado && (
                    <p className="text-muted-foreground">
                        {empleado.nombreCompleto} | {empleado.gerencia} / {empleado.area}
                    </p>
                )}
            </div>
            
            <SolicitudCitaWizard />
        </div>
    );
}
