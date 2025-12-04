"use client";

import React, { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { SolicitudCitaWizard } from '@/components/paciente/SolicitudCitaWizard';
import { EmpleadoEmp2024 } from '@/lib/types/domain';
import { AdminService } from '@/lib/services/admin.service';

export default function SolicitarCitaPage() {
    const { userProfile } = useUserProfile();
    const [empleado, setEmpleado] = useState<EmpleadoEmp2024 | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.carnet) {
            setIsLoading(true);
            AdminService.getEmpleados({ carnet: userProfile.carnet }).then(empleados => {
                if (empleados && empleados.length > 0) {
                    setEmpleado(empleados[0]);
                }
                setIsLoading(false);
            }).catch(err => {
                console.error("Error fetching employee info", err);
                setIsLoading(false);
            });
        }
    }, [userProfile]);

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
