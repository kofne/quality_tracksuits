import { NextRequest, NextResponse } from 'next/server';
import { saveOrderAfterPayment } from '@/lib/firestore';

// Simple rate limiting for orders
const orderRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = orderRateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    orderRateLimitMap.set(ip, { count: 1, resetTime: now + 120000 }); // 2 minute window
    return false;
  }
  
  if (limit.count >= 3) { // Max 3 orders per 2 minutes
    return true;
  }
  
  limit.count++;
  return false;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ 
        error: 'Too many orders. Please wait before submitting another.' 
      }), {
        status: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ 
        error: 'Content-Type must be application/json' 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Parse JSON with error handling
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        return new Response(JSON.stringify({ 
          error: 'Request body is empty' 
        }), {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      }
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body' 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Fast validation
    const { name, email, message, grade, subjects } = body;

    if (!name?.trim() || !email?.trim() || !grade?.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Name, email, and grade are required' 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Please select at least one subject' 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Quick email validation
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ 
        error: 'Please enter a valid email address' 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      message: sanitizeInput(message || ''),
      grade: sanitizeInput(grade),
      subjects: subjects.map(sanitizeInput),
    };

    // Save to Firestore with timeout
    const savePromise = saveOrderAfterPayment(sanitizedData);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 8000)
    );

    await Promise.race([savePromise, timeoutPromise]);

    return new Response(JSON.stringify({ 
      message: "Order submitted successfully" 
    }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API /api/orders error:", error);
    
    return new Response(JSON.stringify({ 
      error: "Failed to submit order. Please try again later." 
    }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 