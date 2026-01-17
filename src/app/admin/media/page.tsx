/**
 * Admin Media Page
 * Simple media gallery view
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Image as ImageIcon, Upload, Eye, Copy, Check } from "lucide-react";
import { getMedia } from "@/lib/local-cms";

export default function AdminMediaPage() {
    const media = getMedia();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-6xl mx-auto">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 p-2 rounded-xl text-white">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                                <p className="text-sm text-slate-500">{media.length} files</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Media Grid */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Upload Notice */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Upload className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-purple-900">To add new media:</p>
                            <p className="text-sm text-purple-700 mt-1">
                                Add files directly to <code className="bg-purple-100 px-1 rounded">/public/assets/images/</code> folder in your project.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-purple-300 transition-colors"
                        >
                            <div className="aspect-square bg-slate-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                                        title="Preview"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleCopyUrl(item.url, item.id)}
                                        className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                                        title="Copy URL"
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400 truncate">{item.url}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {media.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No media files found.</p>
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-8 bg-slate-100 rounded-xl p-4">
                    <p className="text-sm text-slate-600">
                        💡 <strong>Tip:</strong> Hover over any image to preview or copy its URL for use in your content.
                    </p>
                </div>
            </main>
        </div>
    );
}
