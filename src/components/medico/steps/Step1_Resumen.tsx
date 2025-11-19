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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Paciente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Nombre:</strong> {paciente.nombreCompleto}</p>
                        <p><strong>Carnet:</strong> {paciente.carnet}</p>
                        <p><strong>Gerencia:</strong> {empleado.gerencia}</p>
                        <p><strong>Área:</strong> {empleado.area}</p>
                    </CardContent>
                </Card>
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
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Motivo de la Cita</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground italic pl-4 border-l-2">{cita.motivoResumen}</p>
                </CardContent>
             </Card>
        </div>
    );
}
