import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, Timestamp, limit } from 'firebase/firestore';
import type { CitaMedica, Paciente, CasoClinico, SeguimientoPaciente, ExamenMedico } from '@/lib/types/domain';

async function getCollectionData<T>(collectionName: string, pais: string, extraQuery?: any): Promise<T[]> {
    const { firestore } = initializeFirebase();
    const baseQuery = [where('pais', '==', pais)];
    if (extraQuery) {
        baseQuery.push(extraQuery);
    }
    const q = query(collection(firestore, collectionName), ...baseQuery);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idMedico = searchParams.get('idMedico');
    const pais = searchParams.get('pais');

    if (!idMedico || !pais) {
        return NextResponse.json({ message: 'idMedico y pais son requeridos' }, { status: 400 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const { firestore } = initializeFirebase();

        // Citas del día para el médico
        const citasQuery = query(
            collection(firestore, 'citasMedicas'),
            where('idMedico', '==', idMedico),
            where('fechaCita', '>=', today.toISOString().split('T')[0]),
            where('fechaCita', '<', tomorrow.toISOString().split('T')[0])
        );
        const citasSnapshot = await getDocs(citasQuery);
        const citasDelDia: (CitaMedica & { id: string })[] = citasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CitaMedica & { id: string }));

        // Pacientes en rojo (general del país, no solo del médico)
        const pacientesEnRojoQuery = query(
            collection(firestore, 'pacientes'),
            where('pais', '==', pais),
            where('nivelSemaforo', '==', 'R')
        );
        const pacientesEnRojoSnapshot = await getDocs(pacientesEnRojoQuery);

        // Seguimientos pendientes (asignados al médico)
        const seguimientosQuery = query(
            collection(firestore, 'seguimientosPacientes'),
            where('usuarioResponsable', '==', idMedico), // Asumiendo que el responsable es por ID
            where('estadoSeguimiento', '==', 'PENDIENTE')
        );
        const seguimientosSnapshot = await getDocs(seguimientosQuery);

        // Exámenes sin resultado (general del país)
        const examenesQuery = query(
            collection(firestore, 'examenesMedicos'),
            where('pais', '==', pais),
            where('estadoExamen', '==', 'PENDIENTE')
        );
        const examenesSnapshot = await getDocs(examenesQuery);
        
        // Alertas (simulado por ahora)
        const alertas = [
            // { message: 'Luis García ha reportado semáforo ROJO por 3 días seguidos.', type: 'danger' as const },
            // { message: 'Seguimiento de Mariana López está vencido.', type: 'warning' as const },
        ];
        
        // Populate paciente and caso for citasDelDia
        const populatedCitas = await Promise.all(citasDelDia.map(async (cita) => {
            let paciente: Paciente | null = null;
            let caso: CasoClinico | null = null;
            
            const pacienteRef = doc(firestore, 'pacientes', cita.idPaciente);
            const pacienteSnap = await getDoc(pacienteRef);
            if (pacienteSnap.exists()) {
                paciente = pacienteSnap.data() as Paciente;
            }

            if (cita.idCaso) {
                const casoRef = doc(firestore, 'casosClinicos', cita.idCaso);
                const casoSnap = await getDoc(casoRef);
                if (casoSnap.exists()) {
                    caso = casoSnap.data() as CasoClinico;
                }
            }
            return { ...cita, paciente, caso };
        }));


        const data = {
            kpis: {
                citasHoy: citasDelDia.length,
                pacientesEnRojo: pacientesEnRojoSnapshot.size,
                seguimientosPendientes: seguimientosSnapshot.size,
                examenesSinResultado: examenesSnapshot.size,
            },
            citasDelDia: populatedCitas,
            alertas: alertas,
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching medico dashboard data:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        return NextResponse.json({ message: 'Error al obtener datos del dashboard', error: errorMessage }, { status: 500 });
    }
}
