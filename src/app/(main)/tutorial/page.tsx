import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ayuda y Tutorial</h1>
      <p className="text-muted-foreground">
        Bienvenido a la guía de uso de Claro Mi Salud. Aquí encontrarás cómo utilizar las funciones principales de la aplicación según tu rol.
      </p>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="paciente">
          <AccordionTrigger className="text-xl font-semibold">Guía para Pacientes</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>1. Cómo Solicitar una Cita (Chequeo de Bienestar)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Esta es la función principal para reportar tu estado de salud y, si es necesario, iniciar una solicitud de atención médica.</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li><strong>Paso 1: Tu estado hoy.</strong> Indica si te sientes bien o tienes alguna molestia. Si te sientes bien, el proceso es más corto.</li>
                  <li><strong>Paso 2: ¿Qué te molesta?.</strong> Si tienes molestias, selecciona la parte del cuerpo afectada y luego los síntomas específicos. Puedes detallar la intensidad, duración y frecuencia de cada uno.</li>
                  <li><strong>Paso 3: Hábitos y bienestar.</strong> Responde preguntas sobre alergias, sueño y estado de ánimo para dar más contexto.</li>
                  <li><strong>Paso 4: Revisión y envío.</strong> Confirma tu información, añade un comentario final si lo deseas y envía tu solicitud. El equipo médico la revisará y se pondrá en contacto contigo.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Consultar Mis Citas</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>En la sección <strong>"Mis Citas"</strong>, podrás ver un resumen de tu próxima cita programada, así como un historial completo de todas tus citas (programadas, finalizadas o canceladas).</p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>3. Ver Mis Chequeos y Exámenes</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>En <strong>"Mis Chequeos"</strong> encontrarás el historial de todos los chequeos de bienestar que has enviado. En <strong>"Mis Exámenes"</strong>, podrás ver los exámenes que te han solicitado y, una vez que el resultado esté listo, podrás consultarlo haciendo clic en el ícono del ojo.</p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="medico">
          <AccordionTrigger className="text-xl font-semibold">Guía para Médicos</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>1. Gestión de Citas (Triaje)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>En la sección <strong>"Gestión de Citas"</strong> verás todas las solicitudes de pacientes que están pendientes de ser agendadas.</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li><strong>Agendar:</strong> Haz clic en "Agendar" para abrir un formulario donde puedes asignar una fecha, hora y médico a la solicitud, creando así una cita formal.</li>
                  <li><strong>Cancelar:</strong> Si una solicitud no procede, puedes cancelarla especificando un motivo.</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>2. Realizar una Atención Médica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Desde el <strong>Dashboard</strong> o la <strong>Agenda</strong>, puedes iniciar una atención para una cita programada. Esto abrirá un asistente de 5 pasos:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li><strong>Paso 1: Resumen.</strong> Revisa los detalles de la cita y el contexto reportado por el paciente.</li>
                  <li><strong>Paso 2: Signos Vitales.</strong> Registra los signos vitales y el estado clínico general (Bien, Regular, Mal).</li>
                  <li><strong>Paso 3: Diagnóstico y Plan.</strong> Escribe el diagnóstico principal, el plan de tratamiento y las recomendaciones.</li>
                  <li><strong>Paso 4: Seguimiento.</strong> Decide si el paciente necesita una cita de seguimiento y programa una tarea automática en el sistema.</li>
                  <li><strong>Paso 5: Cierre.</strong> Registra acciones adicionales (como vacunas de empresa), anota información psicosocial (confidencial) y guarda la atención.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Consultar Agenda y Casos</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Usa la <strong>"Agenda (Calendario)"</strong> para ver tus citas y seguimientos en una vista de mes. En <strong>"Pacientes y Casos"</strong>, puedes buscar y consultar el historial clínico completo de cualquier paciente.</p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
