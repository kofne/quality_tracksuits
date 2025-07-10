import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';

// Only import Firebase Admin if credentials are available
let getAuth: any;
let initializeApp: any;
let getApps: any;
let cert: any;

try {
  const admin = require('firebase-admin');
  getAuth = admin.auth().getAuth;
  initializeApp = admin.app().initializeApp;
  getApps = admin.app().getApps;
  cert = admin.app().cert;
} catch (error) {
  console.warn('Firebase Admin not available:', error);
}

// Initialize Firebase Admin if not already initialized and credentials are available
if (initializeApp && getApps && cert && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

// Verify Firebase token and check admin status
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    // If Firebase Admin is not available, skip admin verification for now
    if (!getAuth) {
      console.warn('Firebase Admin not available, skipping admin verification');
      return true; // Allow access for development
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Check if the user's email matches the admin email
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return decodedToken.email === adminEmail;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Prepare queries
    const contactsRef = collection(db, 'contacts');
    const contactsQuery = query(
      contactsRef,
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    // Fetch both in parallel
    const [contactsSnapshot, ordersSnapshot] = await Promise.all([
      getDocs(contactsQuery),
      getDocs(ordersQuery)
    ]);

    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      contacts,
      orders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
} 