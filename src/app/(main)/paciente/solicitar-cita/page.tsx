"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SolicitudCitaWizard } from '@/components/paciente/SolicitudCitaWizard';

export default function SolicitarCitaPage() {
    const { usuarioActual } = useAuth();

    // Mock de datos del empleado mientras no venga del contexto/API
    const empleadoMock = {
        nombre: usuarioActual?.nombreCompleto || "Empleado de Prueba",
        gerencia: "Tecnología",
        area: "Desarrollo"
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Chequeo de Bienestar / Solicitud de Cita</h1>
                <p className="text-muted-foreground">
                    {empleadoMock.nombre} | {empleadoMock.gerencia} / {empleadoMock.area}
                </p>
            </div>
            
            <SolicitudCitaWizard />
        </div>
    );
}
