/**
 * Admin Layout
 * Wraps all admin pages with auth check
 */

import { cookies } from 'next/headers';
import { getAdminClient, type AdminSession } from '@/lib/supabase-admin';
import Link from 'next/link';

interface SessionData {
    email: string;
    expires_at: string;
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
            .select('email, expires_at')
            .eq('token_hash', session.value)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) return null;

        return data as SessionData;
    } catch {
        return null;
    }
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAdminSession();

    return (
        <div className="min-h-screen bg-slate-100">
            {session && (
                <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="font-bold text-lg">
                            GoGo CMS
                        </Link>
                        <Link href="/admin/pages" className="text-sm hover:text-primary">
                            Pages
                        </Link>
                        <Link href="/admin/faqs" className="text-sm hover:text-primary">
                            FAQs
                        </Link>
                        <Link href="/admin/media" className="text-sm hover:text-primary">
                            Media
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">{session.email}</span>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600"
                        >
                            View Site →
                        </Link>
                        <form action="/api/admin/auth" method="DELETE">
                            <button
                                type="submit"
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </nav>
            )}
            <main className="p-6">{children}</main>
        </div>
    );
}
