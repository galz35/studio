import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ConfiguracionGeneralPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración General</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parámetros Generales</CardTitle>
            <CardDescription>Ajustes globales del sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="limit-citas">Límite de citas por día</Label>
              <Input id="limit-citas" type="number" defaultValue="50" />
            </div>
             <div className="space-y-2">
              <Label>Horarios de Atención (NI, CR, HN)</Label>
              <div className='flex gap-2 items-center'>
                 <Input id="horario-inicio" type="time" defaultValue="08:00" />
                 <span>-</span>
                 <Input id="horario-fin" type="time" defaultValue="17:00" />
              </div>
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plantillas de Mensajes</CardTitle>
            <CardDescription>Mensajes automáticos para notificaciones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="msg-confirmacion">Mensaje de Confirmación de Cita</Label>
              <Textarea id="msg-confirmacion" defaultValue="Su cita ha sido confirmada para el día [FECHA] a las [HORA]." />
            </div>
            <Button>Guardar Plantillas</Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Parámetros del Semáforo</CardTitle>
            <CardDescription>Explicación de cada nivel para los usuarios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="sema-verde">Nivel Verde (Bienestar)</Label>
              <Textarea id="sema-verde" defaultValue="Indica un buen estado de salud general, sin síntomas de riesgo." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="sema-amarillo">Nivel Amarillo (Precaución)</Label>
              <Textarea id="sema-amarillo" defaultValue="Indica la presencia de síntomas leves o malestares que requieren atención, pero no son una emergencia." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="sema-rojo">Nivel Rojo (Alerta)</Label>
              <Textarea id="sema-rojo" defaultValue="Indica síntomas o condiciones que requieren atención médica prioritaria." />
            </div>
            <Button>Guardar Descripciones</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
