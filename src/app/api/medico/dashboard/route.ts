import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { CitaMedica, Paciente, CasoClinico, SeguimientoPaciente, ExamenMedico } from '@/lib/types/domain';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idMedico = searchParams.get('idMedico');
    const pais = searchParams.get('pais');

    if (!idMedico || !pais) {
        return NextResponse.json({ message: 'idMedico y pais son requeridos' }, { status: 400 });
    }

    const { firestore } = initializeFirebase();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        // --- KPIS ---
        // 1. Citas de Hoy
        const citasHoyQuery = query(
            collection(firestore, 'citasMedicas'),
            where('idMedico', '==', idMedico),
            where('fechaCita', '==', todayStr),
            where('estadoCita', 'in', ['PROGRAMADA', 'CONFIRMADA'])
        );
        const citasHoySnap = await getDocs(citasHoyQuery);
        const citasHoyCount = citasHoySnap.size;

        const populatedCitas = await Promise.all(citasHoySnap.docs.map(async docSnap => {
            const cita = { id: docSnap.id, ...docSnap.data() } as CitaMedica;
            const pacienteSnap = await getDocs(query(collection(firestore, 'pacientes'), where('id', '==', cita.idPaciente)));
            cita.paciente = pacienteSnap.empty ? undefined : { id: pacienteSnap.docs[0].id, ...pacienteSnap.docs[0].data() } as Paciente;
            return cita;
        }));

        // 2. Pacientes en Rojo
        const pacientesRojoQuery = query(
            collection(firestore, 'pacientes'),
            where('pais', '==', pais),
            where('nivelSemaforo', '==', 'R')
        );
        const pacientesRojoSnap = await getDocs(pacientesRojoQuery);
        const pacientesRojoCount = pacientesRojoSnap.size;

        // 3. Seguimientos Pendientes
        const seguimientosPendientesQuery = query(
            collection(firestore, 'seguimientosPacientes'),
            where('usuarioResponsable', '==', idMedico), // Asumiendo que el idMedico se guarda en usuarioResponsable
            where('estadoSeguimiento', '==', 'PENDIENTE')
        );
        const seguimientosPendientesSnap = await getDocs(seguimientosPendientesQuery);
        const seguimientosPendientesCount = seguimientosPendientesSnap.size;
        
        // 4. Exámenes sin Resultado
        const examenesPendientesQuery = query(
            collection(firestore, 'examenesMedicos'),
            where('estadoExamen', '==', 'PENDIENTE')
        );
        const examenesPendientesSnap = await getDocs(examenesPendientesQuery);
        const examenesPendientesCount = examenesPendientesSnap.size; // Esto es a nivel global, se necesitaría un campo 'pais' para filtrar

        // --- Alertas ---
        let alertas: { message: string, type: 'danger' | 'warning' }[] = [];
        if (seguimientosPendientesCount > 0) {
            alertas.push({ message: `Tienes ${seguimientosPendientesCount} seguimientos por vencer.`, type: 'warning' });
        }


        const data = {
            kpis: {
                citasHoy: citasHoyCount,
                pacientesEnRojo: pacientesRojoCount,
                seguimientosPendientes: seguimientosPendientesCount,
                examenesSinResultado: examenesPendientesCount,
            },
            citasDelDia: populatedCitas,
            alertas,
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching medico dashboard data:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        return NextResponse.json({ message: 'Error al obtener datos del dashboard', error: errorMessage }, { status: 500 });
    }
}
