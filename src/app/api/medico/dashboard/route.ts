import { NextResponse } from 'next/server';
import type { CitaMedica, Paciente, CasoClinico, SeguimientoPaciente, ExamenMedico } from '@/lib/types/domain';

// --- Hardcoded Mock Data for this specific API endpoint ---
const today = new Date().toISOString().split('T')[0];

const pacientes: Paciente[] = [
  { id: "paciente-001", idPaciente: 1, carnet: "P001", nombreCompleto: "Ana Sofía Pérez", estadoPaciente: "A", nivelSemaforo: "V", pais: "NI" },
  { id: "paciente-002", idPaciente: 2, carnet: "P002", nombreCompleto: "Luis García", estadoPaciente: "A", nivelSemaforo: "R", pais: "NI" },
];

const citas: (CitaMedica & {id: string})[] = [
  { id: "cita-001", idCita: 1, idCaso: "caso-001", idPaciente: "paciente-001", idMedico: "medico-001", fechaCita: today, horaCita: "10:00", motivoResumen: "Control anual", estadoCita: "PROGRAMADA", nivelSemaforoPaciente: "V", pais: "NI" },
  { id: "cita-002", idCita: 2, idCaso: "caso-002", idPaciente: "paciente-002", idMedico: "medico-001", fechaCita: today, horaCita: "11:00", motivoResumen: "Seguimiento migraña", estadoCita: "PROGRAMADA", nivelSemaforoPaciente: "R", pais: "NI" },
];

const seguimientos: SeguimientoPaciente[] = [
    { idSeguimiento: 1, idCaso: "caso-002", idPaciente: "paciente-002", fechaProgramada: "2024-08-10", tipoSeguimiento: "LLAMADA", estadoSeguimiento: "PENDIENTE", nivelSemaforo: "R", usuarioResponsable: "medico-001", notasSeguimiento: "Verificar efectividad de nuevo tratamiento." }
];

const examenes: ExamenMedico[] = [
    { idExamen: 1, idPaciente: "paciente-002", tipoExamen: "Resonancia Magnética", fechaSolicitud: "2024-07-25", estadoExamen: "PENDIENTE", laboratorio: "Centro de Imágenes" }
];
// --- End of Mock Data ---


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idMedico = searchParams.get('idMedico');
    const pais = searchParams.get('pais');

    if (!idMedico || !pais) {
        return NextResponse.json({ message: 'idMedico y pais son requeridos' }, { status: 400 });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const citasDelDia = citas.filter(c => c.idMedico === idMedico && c.fechaCita === today && c.estadoCita === 'PROGRAMADA');
        const pacientesEnRojo = pacientes.filter(p => p.pais === pais && p.nivelSemaforo === 'R').length;
        const seguimientosPendientes = seguimientos.filter(s => s.usuarioResponsable === idMedico && s.estadoSeguimiento === 'PENDIENTE').length;
        const examenesSinResultado = examenes.filter(e => {
            const pac = pacientes.find(p => p.id === e.idPaciente);
            return pac && pac.pais === pais && e.estadoExamen === 'PENDIENTE';
        }).length;
        
        // Populate paciente for citasDelDia
        const populatedCitas = citasDelDia.map(cita => {
            const paciente = pacientes.find(p => p.id === cita.idPaciente);
            return { ...cita, paciente: paciente || null, caso: null }; // caso is not needed for dashboard view
        });

        const data = {
            kpis: {
                citasHoy: citasDelDia.length,
                pacientesEnRojo: pacientesEnRojo,
                seguimientosPendientes: seguimientosPendientes,
                examenesSinResultado: examenesSinResultado,
            },
            citasDelDia: populatedCitas,
            alertas: seguimientosPendientes > 0 ? [{ message: `Tienes ${seguimientosPendientes} seguimientos por vencer.`, type: 'warning' as const }] : [],
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching medico dashboard data:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        return NextResponse.json({ message: 'Error al obtener datos del dashboard', error: errorMessage }, { status: 500 });
    }
}
