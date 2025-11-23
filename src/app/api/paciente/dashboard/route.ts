import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import type { Paciente, ChequeoBienestar, CitaMedica, SeguimientoPaciente, AtencionMedica, CasoClinico } from '@/lib/types/domain';

// GET: /api/paciente/dashboard?idPaciente=...
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idPaciente = searchParams.get('idPaciente');

    if (!idPaciente) {
        return NextResponse.json({ message: 'idPaciente es requerido' }, { status: 400 });
    }

    const { firestore } = initializeFirebase();

    try {
        // --- Obtener datos principales ---
        const pacienteRef = doc(firestore, 'pacientes', idPaciente);
        const pacienteSnap = await getDoc(pacienteRef);
        if (!pacienteSnap.exists()) {
             return NextResponse.json({ message: `Paciente no encontrado.` }, { status: 404 });
        }
        const paciente = { id: pacienteSnap.id, ...pacienteSnap.data() } as Paciente;
        
        // --- KPIs ---
        // Último Chequeo
        const chequeoQuery = query(collection(firestore, 'chequeosBienestar'), where('idPaciente', '==', idPaciente), orderBy('fechaRegistro', 'desc'), limit(1));
        const chequeoSnap = await getDocs(chequeoQuery);
        const ultimoChequeoData = chequeoSnap.empty ? null : { id: chequeoSnap.docs[0].id, ...chequeoSnap.docs[0].data() } as ChequeoBienestar;

        // Próxima Cita
        const hoyStr = new Date().toISOString().split('T')[0];
        const proximaCitaQuery = query(
            collection(firestore, 'citasMedicas'), 
            where('idPaciente', '==', idPaciente), 
            where('estadoCita', 'in', ['PROGRAMADA', 'CONFIRMADA']),
            where('fechaCita', '>=', hoyStr),
            orderBy('fechaCita', 'asc'),
            limit(1)
        );
        const proximaCitaSnap = await getDocs(proximaCitaQuery);
        const proximaCitaData = proximaCitaSnap.empty ? null : proximaCitaSnap.docs[0].data() as CitaMedica;

        // Seguimientos Activos
        const seguimientosQuery = query(
            collection(firestore, 'seguimientosPacientes'),
            where('idPaciente', '==', idPaciente),
            where('estadoSeguimiento', 'in', ['PENDIENTE', 'EN_PROCESO'])
        );
        const seguimientosSnap = await getDocs(seguimientosQuery);
        const seguimientosActivos = seguimientosSnap.size;

        // --- Línea de Tiempo ---
        let timeline: { title: string; date: string }[] = [];
        if (ultimoChequeoData) {
            timeline.push({ title: `Chequeo de Bienestar`, date: ultimoChequeoData.fechaRegistro });
        }

        // Para las atenciones, primero necesitamos los casos del paciente
        const casosQuery = query(collection(firestore, 'casosClinicos'), where('idPaciente', '==', idPaciente));
        const casosSnap = await getDocs(casosQuery);
        const casosIds = casosSnap.docs.map(d => d.id);

        if (casosIds.length > 0) {
            const atencionesQuery = query(
                collection(firestore, 'atencionesMedicas'), 
                where('idCaso', 'in', casosIds),
                orderBy('fechaAtencion', 'desc'),
                limit(3)
            );
            const atencionesSnap = await getDocs(atencionesQuery);
            atencionesSnap.forEach(d => {
                const a = d.data() as AtencionMedica;
                timeline.push({ title: `Atención: ${a.diagnosticoPrincipal}`, date: a.fechaAtencion });
            });
        }
        
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
