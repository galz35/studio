import { NextResponse } from 'next/server';
import { getFirestore, collection, query, where, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { analisisTriajeMedico } from '@/ai/flows/analisis-triaje-medico';
import { CasoClinico } from '@/lib/types/domain';

// This function can be triggered by a cron job service (e.g., Cloud Scheduler)
// by sending a GET request to /api/cron/procesar-triaje
export async function GET(request: Request) {
    try {
        const { firestore } = initializeFirebase();

        // 1. Consultar la colección de casos clínicos
        const casosRef = collection(firestore, 'casosClinicos');
        const q = query(
            casosRef, 
            where('estadoCaso', '==', 'Abierto'), // Estado inicial
            where('triajeIA', '==', null),       // Que no haya sido procesado por la IA
            limit(15)                            // Límite de 15 por ejecución
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ message: 'No hay casos pendientes para procesar.' });
        }
        
        // 2. Procesar los documentos en paralelo
        const processingPromises = querySnapshot.docs.map(async (casoDoc) => {
            const casoData = casoDoc.data() as CasoClinico;
            
            // Combinar motivo y resumen para dar más contexto a la IA
            const sintomasTexto = `${casoData.motivoConsulta}. ${casoData.resumenClinicoUsuario || ''}`;

            try {
                // 3. Pasar los síntomas por el flow de Genkit
                const resultadoIA = await analisisTriajeMedico({ sintomas: sintomasTexto });

                // 4. Guardar el resultado en el documento y cambiar estado
                const docRef = doc(firestore, 'casosClinicos', casoDoc.id);
                await updateDoc(docRef, {
                    triajeIA: resultadoIA,
                    estadoCaso: 'Triaje-IA' // Nuevo estado para indicar que la IA lo procesó
                });

                return { id: casoDoc.id, status: 'success' };
            } catch (error) {
                console.error(`Error procesando caso ${casoDoc.id}:`, error);
                 const docRef = doc(firestore, 'casosClinicos', casoDoc.id);
                 await updateDoc(docRef, {
                    estadoCaso: 'Error-IA'
                 });
                return { id: casoDoc.id, status: 'error', error: (error as Error).message };
            }
        });

        const results = await Promise.all(processingPromises);
        
        return NextResponse.json({ 
            message: `Procesamiento completado. ${results.length} casos procesados.`,
            results 
        });

    } catch (error) {
        console.error('Error en la función de cron de triaje:', error);
        return new Response(`Error: ${(error as Error).message}`, { status: 500 });
    }
}
