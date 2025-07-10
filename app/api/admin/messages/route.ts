import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  console.log('Admin messages API called');
  
  try {
    console.log('Creating Firestore query...');
    
    // Create a query to get all contacts, ordered by creation date (newest first)
    const contactsQuery = query(
      collection(db, 'contacts'),
      orderBy('createdAt', 'desc')
    );

    console.log('Executing Firestore query...');
    
    // Get the documents
    const querySnapshot = await getDocs(contactsQuery);
    
    console.log(`Found ${querySnapshot.docs.length} messages`);
    
    // Extract the data from each document
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt || null,
    }));

    console.log('Returning messages:', messages.length);
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch messages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 