import { NextResponse } from 'next/server';
import type { Paciente, ChequeoBienestar, CitaMedica, SeguimientoPaciente, AtencionMedica, CasoClinico } from '@/lib/types/domain';

// --- Hardcoded Mock Data for this specific API endpoint ---
const mockData: { [key: string]: any } = {
    "paciente-001": {
        paciente: { id: "paciente-001", nombreCompleto: "Ana Sofía Pérez", nivelSemaforo: "V", pais: "NI" },
        chequeos: [
            { id: "chq-001", idPaciente: "paciente-001", fechaRegistro: "2024-07-30T09:00:00Z", estadoAnimo: "Contento(a)", calidadSueno: "Buena", comentarioGeneral: "Todo bien esta semana.", nivelSemaforo: "V" }
        ],
        citas: [
            { id: "cita-003", idPaciente: "paciente-001", fechaCita: "2024-08-05", horaCita: "10:00", estadoCita: "PROGRAMADA" }
        ],
        seguimientos: [],
        atenciones: [
            { id: "atencion-001", idPaciente: "paciente-001", fechaAtencion: "2024-07-20T11:00:00Z", diagnosticoPrincipal: "Revisión de rutina", idCaso: "caso-001" }
        ],
        casos: [
             { id: "caso-001", idPaciente: "paciente-001" }
        ]
    }
};
// --- End of Mock Data ---


// GET: /api/paciente/dashboard?idPaciente=...
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idPaciente = searchParams.get('idPaciente');

    if (!idPaciente) {
        return NextResponse.json({ message: 'idPaciente es requerido' }, { status: 400 });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const dataForPatient = mockData[idPaciente];

    if (!dataForPatient) {
        return NextResponse.json({ message: `No mock data found for patient ${idPaciente}` }, { status: 404 });
    }

    try {
        const { paciente, chequeos, citas, seguimientos, atenciones } = dataForPatient;

        const ultimoChequeoData = chequeos.length > 0 ? chequeos[0] : null;
        
        const hoy = new Date();
        const proximaCitaData = citas
            .filter((c: CitaMedica) => new Date(c.fechaCita) >= hoy && c.estadoCita === 'PROGRAMADA')
            .sort((a: CitaMedica, b: CitaMedica) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime())[0] || null;

        const seguimientosActivos = seguimientos.filter((s: SeguimientoPaciente) => ['PENDIENTE', 'EN_PROCESO'].includes(s.estadoSeguimiento)).length;
        
        let timeline: { title: string; date: string }[] = [];
        if (ultimoChequeoData) {
            timeline.push({ title: `Chequeo de Bienestar`, date: ultimoChequeoData.fechaRegistro });
        }
        atenciones.forEach((a: AtencionMedica) => {
            timeline.push({ title: `Atención: ${a.diagnosticoPrincipal}`, date: a.fechaAtencion });
        });

        const responseData = {
            kpis: {
                estadoActual: paciente.nivelSemaforo || 'V',
                ultimoChequeo: ultimoChequeoData ? new Date(ultimoChequeoData.fechaRegistro).toLocaleDateString('es-ES') : 'Ninguno',
                proximaCita: proximaCitaData ? `${proximaCitaData.fechaCita} a las ${proximaCitaData.horaCita}` : null,
                seguimientosActivos: seguimientosActivos,
            },
            ultimoChequeoData: ultimoChequeoData,
            timeline: timeline.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error(`Error processing dashboard for patient ${idPaciente}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        return NextResponse.json({ message: 'Error al obtener datos del dashboard del paciente', error: errorMessage }, { status: 500 });
    }
}
