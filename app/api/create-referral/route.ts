import { NextRequest, NextResponse } from 'next/server';
import { createReferralCode } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const result = await createReferralCode(email, name);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating referral code:', error);
    return NextResponse.json(
      { error: 'Failed to create referral code' },
      { status: 500 }
    );
  }
} 