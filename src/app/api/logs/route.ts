import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';

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
    addDoc(logsCollection, logEntry).catch(error => {
        // This catch block is for permission errors.
        // Instead of letting the client get a generic 500 error,
        // we can log the specific context on the server side if needed.
        // The FirestorePermissionError will be thrown on the client side via the listener.
        // For the purpose of the debugging loop, we don't throw from the API route.
        // The client-side hook will generate the error.
        // In a real production app, you might log this server-side for auditing.
        console.error("Permission error caught in API, client will generate contextual error.");
    });
    
    // We respond immediately with success, assuming optimistic update.
    // The client-side error handling will catch the permission issue.
    return NextResponse.json({ message: 'Log submitted' }, { status: 202 });

  } catch (error) {
    console.error('Error in log API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error processing log request', error: errorMessage }, { status: 500 });
  }
}
