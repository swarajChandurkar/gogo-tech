/**
 * Admin Dashboard
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminClient } from '@/lib/supabase-admin';
import Link from 'next/link';

interface SessionData {
    email: string;
}

async function getAdminSession(): Promise<SessionData | null> {
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

        return data as SessionData;
    } catch {
        return null;
    }
}

async function getStats() {
    const client = getAdminClient();
    if (!client) return { pages: 0, faqs: 0, leads: 0 };

    try {
        const [pagesRes, faqsRes, leadsRes] = await Promise.all([
            client.from('pages').select('id', { count: 'exact', head: true }),
            client.from('faqs').select('id', { count: 'exact', head: true }),
            client.from('leads').select('id', { count: 'exact', head: true }),
        ]);

        return {
            pages: pagesRes.count || 0,
            faqs: faqsRes.count || 0,
            leads: leadsRes.count || 0,
        };
    } catch {
        return { pages: 0, faqs: 0, leads: 0 };
    }
}

export default async function AdminDashboard() {
    const session = await getAdminSession();

    if (!session) {
        redirect('/admin/login');
    }

    const stats = await getStats();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back, {session.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pages</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{stats.pages}</p>
                    <Link href="/admin/pages" className="text-sm text-primary hover:underline mt-2 inline-block">
                        Manage Pages →
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">FAQs</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{stats.faqs}</p>
                    <Link href="/admin/faqs" className="text-sm text-primary hover:underline mt-2 inline-block">
                        Manage FAQs →
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Leads</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{stats.leads}</p>
                    <span className="text-sm text-slate-400 mt-2 inline-block">
                        View in Supabase
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/admin/pages"
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Edit Pages
                    </Link>
                    <Link
                        href="/admin/media"
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Toggle Hero Video
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Preview Site →
                    </Link>
                </div>
            </div>

            {/* French Parity Notice */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-amber-800 text-sm">
                    <strong>Reminder:</strong> French translations are required for Hero, About, B2B, and FAQ sections.
                    Pages missing French content will show &quot;Contenu bientôt disponible en français&quot; to French visitors.
                </p>
            </div>
        </div>
    );
}
