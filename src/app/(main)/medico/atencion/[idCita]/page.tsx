"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as api from '@/lib/services/api.mock';
import type { CitaMedica, Paciente, EmpleadoEmp2024 } from '@/lib/types/domain';
import { AtencionCitaWizard } from '@/components/medico/AtencionCitaWizard';
import { Skeleton } from '@/components/ui/skeleton';

type AtencionPageData = {
  cita: CitaMedica;
  paciente: Paciente;
  empleado: EmpleadoEmp2024;
};

export default function AtencionCitaPage() {
  const params = useParams();
  const idCita = Number(params.idCita);
  const [data, setData] = useState<AtencionPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idCita) {
      setError("ID de cita no válido.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const cita = await api.getCitaPorId(idCita);
        if (!cita) {
          throw new Error("Cita no encontrada.");
        }

        const paciente = await api.getPacientePorId(cita.idPaciente);
        if (!paciente) {
          throw new Error("Paciente no encontrado.");
        }

        const empleado = await api.getEmpleadoEmp2024PorCarnet(paciente.carnet);
        if (!empleado) {
          throw new Error("Datos de empleado no encontrados.");
        }

        setData({ cita, paciente, empleado });
      } catch (err: any) {
        setError(err.message || "Ocurrió un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCita]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>;
  }

  if (!data) {
    return <div className="text-center p-8">No se encontraron datos para esta cita.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Atención Médica</h1>

      <AtencionCitaWizard citaData={data} />
    </div>
  );
}
