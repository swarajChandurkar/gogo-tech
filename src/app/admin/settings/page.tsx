/**
 * Admin Settings Page
 * Site configuration interface
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Save, Check, Palette, Globe, Mail, Phone } from "lucide-react";
import { getSettings } from "@/lib/local-cms";

export default function AdminSettingsPage() {
    const initialSettings = getSettings();
    const [settings, setSettings] = useState(initialSettings);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Mock save
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const colorOptions = [
        { name: "Gold", value: "#FFD500" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Green", value: "#22C55E" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Orange", value: "#F97316" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-3xl mx-auto">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-500 p-2 rounded-xl text-white">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                                <p className="text-sm text-slate-500">Site configuration</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${saved
                                    ? "bg-green-500 text-white"
                                    : "bg-primary text-black hover:bg-primary/90"
                                }`}
                        >
                            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? "Saved!" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Settings Form */}
            <main className="max-w-3xl mx-auto px-6 py-8">
                <div className="space-y-6">
                    {/* General */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-slate-400" />
                            General
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Default Language
                                </label>
                                <select
                                    value={settings.defaultLanguage}
                                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Theme */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-slate-400" />
                            Theme Color
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSettings({ ...settings, primaryColor: color.value })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${settings.primaryColor === color.value
                                            ? "border-slate-900 bg-slate-50"
                                            : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div
                                        className="w-5 h-5 rounded-full"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span className="text-sm font-medium">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-slate-400" />
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Help Text */}
                <div className="mt-8 bg-slate-100 rounded-xl p-4">
                    <p className="text-sm text-slate-600">
                        💡 <strong>Note:</strong> Changes are saved in memory for testing.
                        For permanent changes, update the JSON files directly.
                    </p>
                </div>
            </main>
        </div>
    );
}
