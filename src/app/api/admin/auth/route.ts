/**
 * Admin Auth API Route
 * Magic link login for admin panel
 */

import { NextRequest, NextResponse } from 'next/server';


// Rate limiting storage (in production, use Redis)
/**
 * Admin Auth API Route
 * Verifies JWT tokens from Cognito (or generic provider)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-cognito';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 400 });
        }

        // 1. Verify JWT with Cognito
        const payload = await verifyToken(token);

        // 2. (Optional) Check against DB if you restrict access further
        // const { email } = payload; 
        // const res = await query("SELECT 1 FROM admin_users WHERE email = $1", [email]);
        // if (res.rows.length === 0) throw new Error("Unauthorized admin");

        // 3. Set Session Cookie (Optional if using mostly client-side tokens, but handy for server components)
        const response = NextResponse.json({ success: true, user: payload });

        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour (match token expiry)
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('[Admin Auth] Verification failed:', error);
        return NextResponse.json({
            error: 'Authentication failed',
            details: error.message
        }, { status: 401 });
    }
}

// Logout
export async function DELETE(request: NextRequest) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');
    return response;
}
