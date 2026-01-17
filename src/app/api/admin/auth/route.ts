/**
 * Admin Auth API Route
 * Magic link login for admin panel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, logAudit } from '@/lib/supabase-admin';
import crypto from 'crypto';

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (!attempts) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (attempts.count >= MAX_ATTEMPTS) {
        return false;
    }

    attempts.count++;
    return true;
}

/**
 * POST /api/admin/auth - Request magic link
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
        return NextResponse.json({
            error: 'Too many attempts. Try again in 1 minute.',
        }, { status: 429 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Check if email matches admin
        if (email.toLowerCase() !== adminEmail.toLowerCase()) {
            // Don't reveal if email is wrong - always say "sent"
            return NextResponse.json({
                message: 'If this email is authorized, a login link has been sent.',
            });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const client = getAdminClient();
        if (!client) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Store session
        const { error: insertError } = await client.from('admin_sessions').insert({
            email: email.toLowerCase(),
            token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
        });

        if (insertError) {
            console.error('[Admin Auth] Insert error:', insertError);
            // Check for common errors
            if (insertError.code === '42P01') { // relation does not exist
                console.error('Make sure you ran the migration scripts in Supabase!');
            }
            if (insertError.code === '42501') { // insufficient privilege (RLS)
                console.error('Check your Service Role Key permissions!');
            }

            return NextResponse.json({
                error: 'Failed to create session',
                details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
            }, { status: 500 });
        }

        // In production: send email with magic link
        // For now: log the token (development only)
        const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/verify?token=${token}`;

        console.log('[Admin Auth] Magic link generated:', magicLink);

        // Audit log
        await logAudit(client, {
            user_email: email,
            action: 'login_request',
            item_type: 'admin_auth',
        });

        return NextResponse.json({
            message: 'If this email is authorized, a login link has been sent.',
            // Development only - remove in production
            ...(process.env.NODE_ENV === 'development' && { debug_link: magicLink }),
        });
    } catch (error) {
        console.error('[Admin Auth] Error:', error);
        return NextResponse.json({
            error: 'Authentication failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

interface SessionRow {
    id: string;
    email: string;
    token_hash: string;
    expires_at: string;
}

/**
 * GET /api/admin/auth?token=xxx - Verify magic link token
 */
export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const client = getAdminClient();
        if (!client) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        // Find valid session
        const { data, error } = await client
            .from('admin_sessions')
            .select('id, email, token_hash, expires_at')
            .eq('token_hash', tokenHash)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const session = data as SessionRow;

        // Extend session (24 hours)
        const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await client
            .from('admin_sessions')
            .update({ expires_at: newExpiry.toISOString() })
            .eq('id', session.id);

        // Set session cookie
        const response = NextResponse.json({
            success: true,
            email: session.email,
            redirect: '/admin',
        });

        response.cookies.set('admin_session', tokenHash, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/',
        });

        // Audit log
        await logAudit(client, {
            user_email: session.email,
            action: 'login_success',
            item_type: 'admin_auth',
        });

        return response;
    } catch (error) {
        console.error('[Admin Auth] Verify error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/auth - Logout
 */
export async function DELETE(request: NextRequest) {
    const cookieStore = request.cookies;
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (sessionToken) {
        const client = getAdminClient();
        if (client) {
            await client
                .from('admin_sessions')
                .delete()
                .eq('token_hash', sessionToken);
        }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');

    return response;
}
