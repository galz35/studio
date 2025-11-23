
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
    
    // Using addDoc without await for "fire and forget"
    addDoc(logsCollection, logEntry);
    
    return NextResponse.json({ message: 'Log submission accepted' }, { status: 202 });

  } catch (error) {
    // This will mainly catch issues with Firebase initialization or JSON parsing
    console.error('Error in log API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error processing log request', error: errorMessage }, { status: 500 });
  }
}
