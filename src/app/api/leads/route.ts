/**
 * POST /api/leads
 * Handle B2B lead submissions with validation, rate limiting, and notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insertLead, updateLeadEmailStatus } from '@/lib/supabase';
import { sendLeadNotification } from '@/lib/email';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { verifyCaptcha, checkHoneypot } from '@/lib/captcha';

// ============================================================================
// Validation Schema
// ============================================================================

const leadSchema = z.object({
    companyName: z.string().min(2).max(200),
    fleetSize: z.enum(['1-10', '11-50', '50+']),
    fuelType: z.enum(['Diesel', 'Super', 'Both']),
    email: z.string().email().max(254),
    phone: z.string().min(8).max(20),
    captchaToken: z.string().optional(),
    honeypot: z.string().optional(),
});

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // 1. Rate limit check
    const rateLimit = checkRateLimit(ip, '/api/leads');
    if (!rateLimit.allowed) {
        return NextResponse.json(
            {
                success: false,
                error: rateLimit.banned ? 'IP temporarily banned' : 'Too many requests'
            },
            {
                status: 429,
                headers: getRateLimitHeaders(rateLimit)
            }
        );
    }

    // 2. Parse and validate body
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid JSON' },
            { status: 400 }
        );
    }

    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { success: false, error: 'Validation failed', details: validation.error.flatten() },
            { status: 400 }
        );
    }

    const data = validation.data;

    // 3. Honeypot check
    if (!checkHoneypot(data.honeypot)) {
        console.log('[Leads] Honeypot triggered from IP:', ip);
        // Return fake success to confuse bots
        return NextResponse.json({ success: true });
    }

    // 4. CAPTCHA verification
    if (data.captchaToken) {
        const captcha = await verifyCaptcha(data.captchaToken);
        if (!captcha.valid) {
            return NextResponse.json(
                { success: false, error: 'CAPTCHA verification failed' },
                { status: 400 }
            );
        }
    }

    // 5. Insert lead into database
    const { lead, error: dbError } = await insertLead({
        company_name: data.companyName,
        fleet_size: data.fleetSize,
        fuel_type: data.fuelType,
        email: data.email,
        phone: data.phone,
        email_status: 'pending',
    });

    if (dbError || !lead) {
        console.error('[Leads] Database error:', dbError);
        return NextResponse.json(
            { success: false, error: 'Failed to save lead' },
            { status: 500 }
        );
    }

    // 6. Send email notification (with retry)
    const emailResult = await sendLeadNotification({
        companyName: data.companyName,
        fleetSize: data.fleetSize,
        fuelType: data.fuelType,
        email: data.email,
        phone: data.phone,
    });

    // 7. Update lead with email status
    await updateLeadEmailStatus(
        lead.id!,
        emailResult.success ? 'sent' : 'failed',
        emailResult.error
    );

    // 8. Return success
    return NextResponse.json(
        {
            success: true,
            leadId: lead.id,
            emailSent: emailResult.success,
        },
        {
            status: 201,
            headers: getRateLimitHeaders(rateLimit),
        }
    );
}
