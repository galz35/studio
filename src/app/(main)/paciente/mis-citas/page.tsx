"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { PacienteService } from '@/lib/services/paciente.service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export default function MisCitasPage() {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profileLoading) return;

    if (userProfile?.idPaciente) {
      const fetchCitas = async () => {
        try {
          const data = await PacienteService.getMisCitas();
          setCitas(data);
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "No se pudo cargar el historial de citas.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      fetchCitas();
    } else {
      setLoading(false);
    }
  }, [userProfile, profileLoading, toast]);

  if (loading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>;

  if (!userProfile?.idPaciente) return <EmptyState title="No autorizado" message="No se encontró un perfil de paciente asociado." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Citas</h1>
        <Button>Solicitar Nueva Cita</Button>
      </div>

      <div className="grid gap-4">
        {citas.length === 0 ? (
          <EmptyState title="No tienes citas registradas" message="Solicita una nueva cita para comenzar." />
        ) : (
          citas.map((cita) => (
            <Card key={cita.id_cita || cita.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">
                    {cita.motivo || 'Consulta General'}
                  </CardTitle>
                  <Badge variant={cita.estado_cita === 'PROGRAMADA' ? 'default' : 'secondary'}>
                    {cita.estado_cita}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(cita.fecha_cita).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{cita.hora_cita}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Dr. {cita.medico?.nombre_completo || 'Por asignar'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Clínica Central</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
