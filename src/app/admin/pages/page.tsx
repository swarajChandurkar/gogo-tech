/**
 * Admin Pages List
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PageTranslation {
    id: string;
    locale: string;
    title: string;
    is_published: boolean;
    version: number;
    updated_at: string;
}

interface Page {
    id: string;
    slug: string;
    page_type: string;
    fr_required: boolean;
    page_translations: PageTranslation[];
}

export default function AdminPagesPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSlug, setNewSlug] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    async function fetchPages() {
        try {
            const response = await fetch("/api/admin/pages");
            if (response.ok) {
                const data = await response.json();
                setPages(data.pages || []);
            }
        } catch (error) {
            console.error("Failed to fetch pages:", error);
        } finally {
            setLoading(false);
        }
    }

    async function createPage() {
        if (!newSlug.trim()) return;
        setCreating(true);

        try {
            const response = await fetch("/api/admin/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: newSlug.toLowerCase().replace(/\s+/g, "-") }),
            });

            if (response.ok) {
                setNewSlug("");
                fetchPages();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to create page");
            }
        } catch (error) {
            console.error("Create failed:", error);
        } finally {
            setCreating(false);
        }
    }

    function getTranslation(page: Page, locale: string): PageTranslation | undefined {
        return page.page_translations?.find((t) => t.locale === locale);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Pages</h1>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        placeholder="new-page-slug"
                        className="px-4 py-2 border border-slate-200 rounded-lg"
                    />
                    <button
                        onClick={createPage}
                        disabled={creating || !newSlug.trim()}
                        className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        {creating ? "Creating..." : "Create Page"}
                    </button>
                </div>
            </div>

            {pages.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                    <p className="text-slate-500">No pages found. Create your first page above.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Slug</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">English</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">French</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">FR Required</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pages.map((page) => {
                                const enTrans = getTranslation(page, "en");
                                const frTrans = getTranslation(page, "fr");

                                return (
                                    <tr key={page.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm">{page.slug}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {enTrans ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${enTrans.is_published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${enTrans.is_published ? "bg-green-500" : "bg-slate-400"}`}></span>
                                                    {enTrans.is_published ? "Published" : "Draft"}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {frTrans ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${frTrans.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${frTrans.is_published ? "bg-green-500" : "bg-amber-500"}`}></span>
                                                    {frTrans.is_published ? "Published" : "Missing"}
                                                </span>
                                            ) : (
                                                <span className="text-red-400 text-sm">Not created</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {page.fr_required ? (
                                                <span className="text-amber-600 text-sm">Yes</span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/pages/${page.slug}`}
                                                className="text-primary hover:underline text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
