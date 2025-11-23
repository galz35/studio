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

    const docRef = await addDoc(collection(firestore, 'logs'), logEntry);

    return NextResponse.json({ message: 'Log created', logId: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error writing log:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error writing to log', error: errorMessage }, { status: 500 });
  }
}
