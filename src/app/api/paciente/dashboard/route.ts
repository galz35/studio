import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { Paciente, ChequeoBienestar, CitaMedica, SeguimientoPaciente, AtencionMedica } from '@/lib/types/domain';

// GET: /api/paciente/dashboard?idPaciente=...
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idPaciente = searchParams.get('idPaciente');

    if (!idPaciente) {
        return NextResponse.json({ message: 'idPaciente es requerido' }, { status: 400 });
    }

    try {
        const { firestore } = initializeFirebase();

        // 1. Obtener datos del paciente
        const pacienteRef = doc(firestore, 'pacientes', idPaciente);
        const pacienteSnap = await getDoc(pacienteRef);
        if (!pacienteSnap.exists()) {
            return NextResponse.json({ message: 'Paciente no encontrado' }, { status: 404 });
        }
        const pacienteData = pacienteSnap.data() as Paciente;

        // 2. Obtener último chequeo
        const chequeosQuery = query(
            collection(firestore, 'chequeosBienestar'),
            where('idPaciente', '==', idPaciente),
            orderBy('fechaRegistro', 'desc'),
            limit(1)
        );
        const chequeosSnap = await getDocs(chequeosQuery);
        const ultimoChequeoData = chequeosSnap.empty ? null : (chequeosSnap.docs[0].data() as ChequeoBienestar);
        
        // 3. Obtener próxima cita
        const hoy = new Date().toISOString().split('T')[0];
        const citasQuery = query(
            collection(firestore, 'citasMedicas'),
            where('idPaciente', '==', idPaciente),
            where('fechaCita', '>=', hoy),
            where('estadoCita', 'in', ['PROGRAMADA', 'CONFIRMADA']),
            orderBy('fechaCita', 'asc'),
            limit(1)
        );
        const citasSnap = await getDocs(citasQuery);
        const proximaCitaData = citasSnap.empty ? null : (citasSnap.docs[0].data() as CitaMedica);
        
        // 4. Contar seguimientos activos
        const seguimientosQuery = query(
            collection(firestore, 'seguimientosPacientes'),
            where('idPaciente', '==', idPaciente),
            where('estadoSeguimiento', 'in', ['PENDIENTE', 'EN_PROCESO'])
        );
        const seguimientosSnap = await getDocs(seguimientosQuery);
        const seguimientosActivos = seguimientosSnap.size;

        // 5. Construir Timeline (ejemplo)
        let timeline: { title: string; date: string }[] = [];

        const casosQuery = query(collection(firestore, 'casosClinicos'), where('idPaciente', '==', idPaciente));
        const casosSnap = await getDocs(casosQuery);
        const casosIds = casosSnap.docs.map(d => d.id);
        
        if (casosIds.length > 0) {
            const atencionesQuery = query(
                collection(firestore, 'atencionesMedicas'), 
                where('idCaso', 'in', casosIds), 
                orderBy('fechaAtencion', 'desc'), 
                limit(2)
            );
            const atencionesSnap = await getDocs(atencionesQuery);
            const atencionesTimeline = atencionesSnap.docs.map(d => {
                const data = d.data() as AtencionMedica;
                return { title: `Atención: ${data.diagnosticoPrincipal}`, date: data.fechaAtencion };
            });
            timeline.push(...atencionesTimeline);
        }

        if (ultimoChequeoData) {
            timeline.push({ title: `Chequeo de Bienestar`, date: ultimoChequeoData.fechaRegistro });
        }


        // Construir respuesta
        const data = {
            kpis: {
                estadoActual: pacienteData.nivelSemaforo || 'V',
                ultimoChequeo: ultimoChequeoData ? new Date(ultimoChequeoData.fechaRegistro).toLocaleDateString('es-ES') : 'Ninguno',
                proximaCita: proximaCitaData ? `${proximaCitaData.fechaCita} a las ${proximaCitaData.horaCita}` : null,
                seguimientosActivos: seguimientosActivos,
            },
            ultimoChequeoData: ultimoChequeoData,
            timeline: timeline.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching paciente dashboard data:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        return NextResponse.json({ message: 'Error al obtener datos del dashboard del paciente', error: errorMessage }, { status: 500 });
    }
}
