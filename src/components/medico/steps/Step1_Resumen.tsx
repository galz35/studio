"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import type { CitaMedica, Paciente, EmpleadoEmp2024 } from '@/lib/types/domain';

interface Step1Props {
    citaData: {
        cita: CitaMedica;
        paciente: Paciente;
        empleado: EmpleadoEmp2024;
    };
}

export function Step1_Resumen({ citaData }: Step1Props) {
    const { cita, paciente, empleado } = citaData;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Cita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p><strong>Fecha y Hora:</strong> {new Date(cita.fechaCita).toLocaleDateString('es-ES')} a las {cita.horaCita}</p>
                    <p><strong>Origen:</strong> {cita.canalOrigen}</p>
                     <div className="flex items-center gap-2">
                        <strong>Semáforo del Paciente:</strong> 
                        <SemaforoBadge nivel={cita.nivelSemaforoPaciente} />
                    </div>
                    <p><strong>Motivo de la Cita:</strong></p>
                    <p className="text-muted-foreground italic pl-4 border-l-2">{cita.motivoResumen}</p>
                </CardContent>
            </Card>
        </div>
    );
}
