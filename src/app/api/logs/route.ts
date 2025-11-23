
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
    
    // We await the operation here to catch potential errors
    await addDoc(logsCollection, logEntry);
    
    return NextResponse.json({ message: 'Log submitted' }, { status: 201 });

  } catch (error) {
    console.error('Error in log API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    // Check if the error is a Firestore permission error
    if (errorMessage.toLowerCase().includes('permission-denied') || errorMessage.toLowerCase().includes('missing or insufficient permissions')) {
        // Send a specific, machine-readable error message to the client
        return NextResponse.json({ message: 'Firestore Permission Error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Error processing log request', error: errorMessage }, { status: 500 });
  }
}
