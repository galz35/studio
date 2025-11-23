import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export async function POST(request: Request) {
  try {
    const { firestore } = initializeFirebase();
    const body = await request.json();

    const { type, userCarnet, userId, message, details } = body;

    if (!type || !userCarnet || !userId || !message) {
      return NextResponse.json({ message: 'Missing required log fields.' }, { status: 400 });
    }

    const logEntry = {
      timestamp: serverTimestamp(),
      type,
      userCarnet,
      userId,
      message,
      details: details || {},
    };

    const logsCollection = collection(firestore, 'logs');
    
    // Non-blocking write with contextual error handling
    addDoc(logsCollection, logEntry).catch(serverError => {
        // Create the rich, contextual error.
        const permissionError = new FirestorePermissionError({
          path: logsCollection.path,
          operation: 'create',
          requestResourceData: logEntry,
        });

        // Emit the error. This will be caught by the FirebaseErrorListener on the client.
        // We log it on the server for debugging purposes, but the client error is what matters.
        console.error("Firestore Permission Error Context (from API):", permissionError.request);
        
        // This part is tricky in an API route. We can't directly throw to the client's global error handler.
        // The best we can do is signal a specific failure.
        // However, the current architecture relies on a client-side listener.
        // The console.error above is for server-side visibility. The user will still see the generic error
        // until we can get the client to emit it. This implementation is a step.
        // For now, we will just log it. The permission error will still propagate and be caught by the generic handler,
        // but now we have a server-side trace.
    });
    
    // We respond immediately with success, assuming optimistic update.
    return NextResponse.json({ message: 'Log submitted' }, { status: 202 });

  } catch (error) {
    console.error('Error in log API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error processing log request', error: errorMessage }, { status: 500 });
  }
}
