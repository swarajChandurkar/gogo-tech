/**
 * CMS Database Helpers
 * Server-side functions for fetching and managing CMS content
 * Replaces Contentful client with Supabase
 */

import { getPublicClient, getAdminClient, logAudit, type PageTranslation, type FAQTranslation, type BlogTranslation, type MediaMeta } from './supabase-admin';
import { dictionary } from '@/data/translations';

// ============================================================================
// Types
// ============================================================================

export interface CMSPage {
    slug: string;
    locale: 'en' | 'fr';
    title: string;
    body: Record<string, unknown>;
    seo_title?: string;
    seo_description?: string;
    is_published: boolean;
    fr_required: boolean;
}

export interface CMSFAQ {
    id: string;
    category: string;
    question: string;
    answer: string;
    sort_order: number;
}

export interface CMSBlogPost {
    slug: string;
    title: string;
    body: string;
    excerpt?: string;
    author?: string;
    featured_image_url?: string;
    tags: string[];
    published_date?: string;
    seo_title?: string;
    seo_description?: string;
}

// ============================================================================
// Page Content
// ============================================================================

/**
 * Get page content by slug and locale
 * Returns null if page doesn't exist or locale translation is not published
 */
export async function getPage(slug: string, locale: 'en' | 'fr'): Promise<CMSPage | null> {
    const client = getPublicClient();
    if (!client) return null;

    try {
        // Fetch page with translation
        const { data: page, error: pageError } = await client
            .from('pages')
            .select('id, slug, fr_required')
            .eq('slug', slug)
            .single();

        if (pageError || !page) return null;

        // Fetch translation for the requested locale
        const { data: translation, error: transError } = await client
            .from('page_translations')
            .select('*')
            .eq('page_id', page.id)
            .eq('locale', locale)
            .eq('is_published', true)
            .single();

        if (transError || !translation) return null;

        return {
            slug: page.slug,
            locale: translation.locale as 'en' | 'fr',
            title: translation.title || '',
            body: (translation.body as Record<string, unknown>) || {},
            seo_title: translation.seo_title || undefined,
            seo_description: translation.seo_description || undefined,
            is_published: translation.is_published,
            fr_required: page.fr_required,
        };
    } catch (error) {
        console.error('[CMS] Failed to fetch page:', error);
        return null;
    }
}

/**
 * Check if French translation exists and is published for a page
 */
export async function isFrenchPublished(slug: string): Promise<boolean> {
    const client = getPublicClient();
    if (!client) return false;

    try {
        const { data: page } = await client
            .from('pages')
            .select('id')
            .eq('slug', slug)
            .single();

        if (!page) return false;

        const { data: translation } = await client
            .from('page_translations')
            .select('is_published')
            .eq('page_id', page.id)
            .eq('locale', 'fr')
            .eq('is_published', true)
            .single();

        return Boolean(translation);
    } catch {
        return false;
    }
}

// ============================================================================
// FAQs
// ============================================================================

/**
 * Get FAQs by category and locale
 * Returns published FAQs only
 */
export async function getFAQs(category: string | null, locale: 'en' | 'fr'): Promise<CMSFAQ[]> {
    const client = getPublicClient();

    // Fallback to local dictionary
    if (!client) {
        const fallback = dictionary[locale].faq.items;
        return fallback.map((item, index) => ({
            id: `local-${index}`,
            category: 'general',
            question: item.q,
            answer: item.a,
            sort_order: index,
        }));
    }

    try {
        let query = client
            .from('faqs')
            .select(`
                id,
                category,
                sort_order,
                faq_translations!inner(question, answer, is_published)
            `)
            .eq('is_active', true)
            .eq('faq_translations.locale', locale)
            .eq('faq_translations.is_published', true)
            .order('sort_order', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error || !data) {
            console.error('[CMS] FAQ fetch error:', error);
            return [];
        }

        return data.map((faq) => {
            const trans = Array.isArray(faq.faq_translations)
                ? faq.faq_translations[0]
                : faq.faq_translations;
            return {
                id: faq.id,
                category: faq.category,
                question: trans?.question || '',
                answer: trans?.answer || '',
                sort_order: faq.sort_order,
            };
        });
    } catch (error) {
        console.error('[CMS] Failed to fetch FAQs:', error);
        return [];
    }
}

/**
 * Search FAQs using full-text search
 */
export async function searchFAQs(query: string, locale: 'en' | 'fr'): Promise<CMSFAQ[]> {
    const client = getPublicClient();
    if (!client || !query.trim()) return [];

    try {
        // Use Postgres full-text search
        const { data, error } = await client
            .from('faq_translations')
            .select(`
                id,
                faq_id,
                question,
                answer,
                faqs!inner(id, category, sort_order, is_active)
            `)
            .eq('locale', locale)
            .eq('is_published', true)
            .eq('faqs.is_active', true)
            .textSearch('search_vector', query, { type: 'websearch' })
            .limit(10);

        if (error || !data) return [];

        return data.map((item) => {
            const faq = Array.isArray(item.faqs) ? item.faqs[0] : item.faqs;
            return {
                id: item.faq_id,
                category: faq?.category || 'general',
                question: item.question,
                answer: item.answer,
                sort_order: faq?.sort_order || 0,
            };
        });
    } catch (error) {
        console.error('[CMS] FAQ search error:', error);
        return [];
    }
}

// ============================================================================
// Blog Posts
// ============================================================================

/**
 * Get all published blog posts for a locale
 */
export async function getBlogPosts(locale: 'en' | 'fr'): Promise<CMSBlogPost[]> {
    const client = getPublicClient();
    if (!client) return [];

    try {
        const { data, error } = await client
            .from('blog_posts')
            .select(`
                slug,
                author,
                featured_image_url,
                tags,
                published_date,
                blog_translations!inner(title, body, excerpt, seo_title, seo_description, is_published)
            `)
            .eq('blog_translations.locale', locale)
            .eq('blog_translations.is_published', true)
            .order('published_date', { ascending: false });

        if (error || !data) return [];

        return data.map((post) => {
            const trans = Array.isArray(post.blog_translations)
                ? post.blog_translations[0]
                : post.blog_translations;
            return {
                slug: post.slug,
                title: trans?.title || '',
                body: trans?.body || '',
                excerpt: trans?.excerpt || undefined,
                author: post.author || undefined,
                featured_image_url: post.featured_image_url || undefined,
                tags: post.tags || [],
                published_date: post.published_date || undefined,
                seo_title: trans?.seo_title || undefined,
                seo_description: trans?.seo_description || undefined,
            };
        });
    } catch (error) {
        console.error('[CMS] Failed to fetch blog posts:', error);
        return [];
    }
}

/**
 * Get single blog post by slug
 */
export async function getBlogPostBySlug(slug: string, locale: 'en' | 'fr'): Promise<CMSBlogPost | null> {
    const client = getPublicClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('blog_posts')
            .select(`
                slug,
                author,
                featured_image_url,
                tags,
                published_date,
                blog_translations!inner(title, body, excerpt, seo_title, seo_description, is_published)
            `)
            .eq('slug', slug)
            .eq('blog_translations.locale', locale)
            .eq('blog_translations.is_published', true)
            .single();

        if (error || !data) return null;

        const trans = Array.isArray(data.blog_translations)
            ? data.blog_translations[0]
            : data.blog_translations;

        return {
            slug: data.slug,
            title: trans?.title || '',
            body: trans?.body || '',
            excerpt: trans?.excerpt || undefined,
            author: data.author || undefined,
            featured_image_url: data.featured_image_url || undefined,
            tags: data.tags || [],
            published_date: data.published_date || undefined,
            seo_title: trans?.seo_title || undefined,
            seo_description: trans?.seo_description || undefined,
        };
    } catch (error) {
        console.error('[CMS] Failed to fetch blog post:', error);
        return null;
    }
}

// ============================================================================
// Media
// ============================================================================

/**
 * Get media metadata by key
 */
export async function getMediaMeta(key: string): Promise<MediaMeta | null> {
    const client = getPublicClient();
    if (!client) return null;

    try {
        const { data, error } = await client
            .from('media_meta')
            .select('*')
            .eq('key', key)
            .single();

        if (error || !data) return null;
        return data;
    } catch {
        return null;
    }
}

/**
 * Check if hero video is enabled
 */
export async function isHeroVideoEnabled(): Promise<boolean> {
    const meta = await getMediaMeta('hero_video');
    return meta?.is_enabled ?? false;
}

// ============================================================================
// Admin Operations (Server-side only)
// ============================================================================

/**
 * Publish a translation (admin only)
 */
export async function publishTranslation(
    translationId: string,
    userEmail: string
): Promise<boolean> {
    const client = getAdminClient();
    if (!client) return false;

    try {
        // Get current state for audit
        const { data: before } = await client
            .from('page_translations')
            .select('*')
            .eq('id', translationId)
            .single();

        // Update
        const { error } = await client
            .from('page_translations')
            .update({
                is_published: true,
                published_at: new Date().toISOString(),
            })
            .eq('id', translationId);

        if (error) throw error;

        // Log audit
        await logAudit(client, {
            user_email: userEmail,
            action: 'publish',
            item_type: 'page_translation',
            item_id: translationId,
            before_state: before || undefined,
            after_state: { ...before, is_published: true },
        });

        return true;
    } catch (error) {
        console.error('[CMS] Publish failed:', error);
        return false;
    }
}

/**
 * Save version to history before updating
 */
export async function saveVersion(
    translationId: string,
    userEmail: string
): Promise<void> {
    const client = getAdminClient();
    if (!client) return;

    try {
        // Get current translation
        const { data: current } = await client
            .from('page_translations')
            .select('version, body, title')
            .eq('id', translationId)
            .single();

        if (!current) return;

        // Save to history
        await client.from('content_history').insert({
            translation_id: translationId,
            version: current.version,
            body: current.body,
            title: current.title,
            changed_by: userEmail,
        });

        // Keep only last 3 versions
        const { data: history } = await client
            .from('content_history')
            .select('id')
            .eq('translation_id', translationId)
            .order('version', { ascending: false });

        if (history && history.length > 3) {
            const toDelete = history.slice(3).map((h) => h.id);
            await client.from('content_history').delete().in('id', toDelete);
        }
    } catch (error) {
        console.error('[CMS] Save version failed:', error);
    }
}

// ============================================================================
// ISR Revalidation
// ============================================================================

export const CMS_REVALIDATE = 60; // seconds
