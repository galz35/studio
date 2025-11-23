"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SolicitudCitaWizard } from '@/components/paciente/SolicitudCitaWizard';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import { EmpleadoEmp2024 } from '@/lib/types/domain';

export default function SolicitarCitaPage() {
    const { usuarioActual } = useAuth();
    const { firestore } = useFirebase();

    const empleadoQuery = useMemoFirebase(() => {
        if (!firestore || !usuarioActual) return null;
        return query(collection(firestore, 'empleadosEmp2024'), where('carnet', '==', usuarioActual.carnet));
    }, [firestore, usuarioActual]);

    const { data: empleadoData, isLoading } = useCollection<EmpleadoEmp2024>(empleadoQuery);
    const empleado = empleadoData?.[0];

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
