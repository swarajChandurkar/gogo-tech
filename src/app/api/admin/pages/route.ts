/**
 * Admin Pages API Route
 * CRUD operations for CMS pages
 * Protected by admin auth middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, logAudit } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

// Verify admin session (simple token check)
async function verifyAdmin(request: NextRequest): Promise<string | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!session?.value || !adminEmail) {
        return null;
    }

    // In production: verify JWT or session token properly
    // For now: simple check that session exists
    const client = getAdminClient();
    if (!client) return null;

    const { data } = await client
        .from('admin_sessions')
        .select('email')
        .eq('token_hash', session.value)
        .gt('expires_at', new Date().toISOString())
        .single();

    return data?.email || null;
}

/**
 * GET /api/admin/pages - List all pages with translations
 */
export async function GET(request: NextRequest) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    try {
        const { data: pages, error } = await client
            .from('pages')
            .select(`
                id,
                slug,
                page_type,
                fr_required,
                created_at,
                updated_at,
                page_translations(id, locale, title, is_published, version, updated_at)
            `)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ pages });
    } catch (error) {
        console.error('[Admin API] List pages error:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}

/**
 * POST /api/admin/pages - Create a new page
 */
export async function POST(request: NextRequest) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { slug, page_type = 'page', fr_required = true } = body;

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Check for existing slug
        const { data: existing } = await client
            .from('pages')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        // Create page
        const { data: page, error } = await client
            .from('pages')
            .insert({ slug, page_type, fr_required })
            .select()
            .single();

        if (error) throw error;

        // Create empty EN and FR translations
        await client.from('page_translations').insert([
            { page_id: page.id, locale: 'en', title: '', body: {} },
            { page_id: page.id, locale: 'fr', title: '', body: {} },
        ]);

        // Audit log
        await logAudit(client, {
            user_email: adminEmail,
            action: 'create',
            item_type: 'page',
            item_id: page.id,
            after_state: page,
        });

        return NextResponse.json({ page }, { status: 201 });
    } catch (error) {
        console.error('[Admin API] Create page error:', error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}
