/**
 * Admin Page Detail API Route
 * Get, update, delete individual pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, logAudit } from '@/lib/supabase-admin';
import { saveVersion } from '@/lib/cms-db';
import { cookies } from 'next/headers';

// Verify admin session
async function verifyAdmin(request: NextRequest): Promise<string | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    // DEV: Bypass
    if (!session?.value) return "dev@gogo.bj";
    // if (!session?.value) return null;

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

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/pages/[id] - Get page with all translations
 */
export async function GET(request: NextRequest, context: RouteContext) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    const { id } = await context.params;

    try {
        const { data: page, error } = await client
            .from('pages')
            .select(`
                *,
                page_translations(*)
            `)
            .eq('id', id)
            .single();

        if (error || !page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Get version history
        const translations = page.page_translations || [];
        const historyPromises = translations.map(async (trans: { id: string }) => {
            const { data: history } = await client
                .from('content_history')
                .select('*')
                .eq('translation_id', trans.id)
                .order('version', { ascending: false })
                .limit(3);
            return { translation_id: trans.id, history: history || [] };
        });

        const histories = await Promise.all(historyPromises);

        return NextResponse.json({ page, histories });
    } catch (error) {
        console.error('[Admin API] Get page error:', error);
        return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/pages/[id] - Update page metadata or translation
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    const { id } = await context.params;

    try {
        const body = await request.json();
        const { translation_id, locale, title, content, seo_title, seo_description, fr_required } = body;

        // If updating page metadata (fr_required)
        if (typeof fr_required === 'boolean') {
            const { data: before } = await client
                .from('pages')
                .select('*')
                .eq('id', id)
                .single();

            const { error } = await client
                .from('pages')
                .update({ fr_required })
                .eq('id', id);

            if (error) throw error;

            await logAudit(client, {
                user_email: adminEmail,
                action: 'update',
                item_type: 'page',
                item_id: id,
                before_state: before,
                after_state: { ...before, fr_required },
            });
        }

        // If updating translation
        if (translation_id) {
            // Save version before updating
            await saveVersion(translation_id, adminEmail);

            const { data: before } = await client
                .from('page_translations')
                .select('*')
                .eq('id', translation_id)
                .single();

            const updateData: Record<string, unknown> = {};
            if (title !== undefined) updateData.title = title;
            if (content !== undefined) updateData.body = content;
            if (seo_title !== undefined) updateData.seo_title = seo_title;
            if (seo_description !== undefined) updateData.seo_description = seo_description;
            updateData.version = (before?.version || 0) + 1;

            const { error } = await client
                .from('page_translations')
                .update(updateData)
                .eq('id', translation_id);

            if (error) throw error;

            await logAudit(client, {
                user_email: adminEmail,
                action: 'update',
                item_type: 'page_translation',
                item_id: translation_id,
                before_state: before,
                after_state: { ...before, ...updateData },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Admin API] Update page error:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/pages/[id] - Delete page and all translations
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    const { id } = await context.params;

    try {
        const { data: before } = await client
            .from('pages')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await client
            .from('pages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await logAudit(client, {
            user_email: adminEmail,
            action: 'delete',
            item_type: 'page',
            item_id: id,
            before_state: before,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Admin API] Delete page error:', error);
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
}
