import { NextRequest, NextResponse } from 'next/server';
import { getAllTracksuitOrders } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication (basic check)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getAllTracksuitOrders();
    
    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 