/**
 * Admin Publish API Route
 * Publish/unpublish translations with pre-publish checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, logAudit } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

interface SessionRow {
    email: string;
}

// Verify admin session
async function verifyAdmin(request: NextRequest): Promise<string | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session?.value) return null;

    const client = getAdminClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('admin_sessions')
            .select('email')
            .eq('token_hash', session.value)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) return null;
        return (data as SessionRow).email;
    } catch {
        return null;
    }
}

interface RouteContext {
    params: Promise<{ id: string }>;
}

interface TranslationRow {
    id: string;
    page_id: string;
    locale: string;
    is_published: boolean;
}

interface PageRow {
    slug: string;
    fr_required: boolean;
}

/**
 * POST /api/admin/pages/[id]/publish - Publish a translation
 * Body: { translation_id: string, action: 'publish' | 'unpublish' }
 */
export async function POST(request: NextRequest, context: RouteContext) {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAdminClient();
    if (!client) {
        return NextResponse.json({ error: 'CMS not configured' }, { status: 500 });
    }

    const { id: pageId } = await context.params;

    try {
        const body = await request.json();
        const { translation_id, action = 'publish' } = body;

        if (!translation_id) {
            return NextResponse.json({ error: 'translation_id required' }, { status: 400 });
        }

        // Get translation info
        const { data: transData, error: transError } = await client
            .from('page_translations')
            .select('id, page_id, locale, is_published')
            .eq('id', translation_id)
            .eq('page_id', pageId)
            .single();

        if (transError || !transData) {
            return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
        }

        const translation = transData as TranslationRow;

        // Get page info
        const { data: pageData } = await client
            .from('pages')
            .select('slug, fr_required')
            .eq('id', pageId)
            .single();

        const page = pageData as PageRow | null;

        // Pre-publish checks for French-required pages when publishing EN
        if (action === 'publish' && translation.locale === 'en' && page?.fr_required) {
            // Check if FR translation exists and has content
            const { data: frData } = await client
                .from('page_translations')
                .select('id, title, body, is_published')
                .eq('page_id', pageId)
                .eq('locale', 'fr')
                .single();

            const frTranslation = frData as { id: string; title: string | null; body: Record<string, unknown> | null; is_published: boolean } | null;
            const frHasContent = frTranslation && frTranslation.title && Object.keys(frTranslation.body || {}).length > 0;

            if (!frHasContent) {
                return NextResponse.json({
                    warning: 'French translation is empty. This page requires French parity.',
                    fr_missing: true,
                    can_proceed: true, // Allow but warn
                }, { status: 200 });
            }
        }

        // Perform publish/unpublish
        const updateData = action === 'publish'
            ? { is_published: true, published_at: new Date().toISOString() }
            : { is_published: false, published_at: null };

        const { error: updateError } = await client
            .from('page_translations')
            .update(updateData)
            .eq('id', translation_id);

        if (updateError) throw updateError;

        // Audit log
        await logAudit(client, {
            user_email: adminEmail,
            action: action,
            item_type: 'page_translation',
            item_id: translation_id,
            before_state: { is_published: translation.is_published },
            after_state: updateData,
        });

        return NextResponse.json({
            success: true,
            action,
            published: action === 'publish',
        });
    } catch (error) {
        console.error('[Admin API] Publish error:', error);
        return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
    }
}
