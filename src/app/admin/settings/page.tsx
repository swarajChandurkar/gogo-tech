"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Settings,
    Save,
    Check,
    Loader2,
    Info,
    Truck,
    Zap,
    Wrench,
    Instagram,
    Linkedin,
    Menu,
    Signal,
    Wifi,
    BatteryFull,
    ArrowRight,
    Fuel,
    Search,
    Bell,
    Smartphone,
    Monitor
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "",
        tagline: "",
        contactEmail: "",
        contactPhone: "",
        defaultLanguage: "en",
        mission: "Delivering premium energy solutions with imperial precision and sustainable innovation.",
        vision: "To become the global standard for luxury fleet energy management by 2030.",
        socialInstagram: "@gogoimperial",
        socialLinkedin: "/company/gogo-energy",
        services: {
            fuel: true,
            ev: false,
            maintenance: true
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                // Merge fetched data with default content structure if keys missing
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className={`min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans ${montserrat.className}`}>
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 w-full border-b border-gray-200 shadow-sm">
                <div className="max-w-[1920px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-[#FFB300] flex items-center justify-center text-white shadow-md">
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h1 className="text-gray-900 text-lg font-black uppercase tracking-wider leading-none">GoGo</h1>
                                <h2 className="text-[#FFB300] text-xs font-bold uppercase tracking-[0.2em] leading-none mt-0.5">Imperial</h2>
                            </div>
                        </div>
                        <div className="hidden md:flex relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#FFB300] transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                className="h-10 w-72 rounded-lg pl-10 pr-4 text-sm placeholder-gray-400 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FFB300] focus:ring-1 focus:ring-[#FFB300] outline-none transition-all"
                                placeholder="Search modules..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative flex h-8 w-20 items-center rounded-full bg-gray-100 p-1 cursor-pointer border border-gray-200">
                            <div className="absolute left-1 h-6 w-8 rounded-full bg-white shadow-sm border border-gray-100"></div>
                            <span className="z-10 w-1/2 text-center text-[10px] font-bold text-gray-900">EN</span>
                            <span className="z-10 w-1/2 text-center text-[10px] font-bold text-gray-400">FR</span>
                        </button>
                        <button className="relative text-gray-400 hover:text-[#FFB300] transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0.5 right-0.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="bg-gray-200 rounded-full size-9 ring-2 ring-gray-100 overflow-hidden">
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold">A</div>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-bold text-gray-800 leading-tight">Admin User</p>
                                <p className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative z-10 h-[calc(100vh-80px)]">
                <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row h-full">
                    {/* Left Panel: Form */}
                    <div className="flex-1 lg:w-3/5 overflow-y-auto p-6 lg:p-12 pb-32 scroll-smooth">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-wider border border-green-200">v2.4.0 Live</span>
                                    {saved && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider border border-gray-200">Saved just now</span>}
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Content Dashboard</h2>
                                <p className="text-gray-500">Manage your application content and settings.</p>
                            </div>

                            {/* About Section */}
                            <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-6 relative group hover:shadow-md transition-shadow">
                                <div className="absolute top-6 right-6 text-gray-200">
                                    <Info className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="size-2.5 rounded-full bg-[#FFB300]"></span>
                                    About Us Information
                                </h3>
                                <div className="grid gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mission Statement</span>
                                        <textarea
                                            className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-4 min-h-[100px] text-sm leading-relaxed resize-none focus:border-[#FFB300] focus:bg-white focus:ring-4 focus:ring-[#FFB300]/10 outline-none transition-all"
                                            placeholder="Enter mission statement..."
                                            value={settings.mission}
                                            onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Vision Statement</span>
                                        <textarea
                                            className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-4 min-h-[100px] text-sm leading-relaxed resize-none focus:border-[#FFB300] focus:bg-white focus:ring-4 focus:ring-[#FFB300]/10 outline-none transition-all"
                                            placeholder="Enter vision statement..."
                                            value={settings.vision}
                                            onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Services Section */}
                            <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-6 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="size-2.5 rounded-full bg-[#FFD54F]"></span>
                                    Services Configuration
                                </h3>
                                <div className="space-y-3">
                                    {/* Fuel Service */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#FFB300]/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm text-gray-600 group-hover:text-[#FFB300] transition-colors">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Fuel Delivery</p>
                                                <p className="text-xs text-gray-500">Premium gasoline & diesel</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">ACTIVE</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.services.fuel} onChange={(e) => setSettings({ ...settings, services: { ...settings.services, fuel: e.target.checked } })} />
                                                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFB300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFB300]"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* EV Service */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#FFB300]/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm text-gray-600 group-hover:text-[#FFB300] transition-colors">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">EV Charging</p>
                                                <p className="text-xs text-gray-500">Supercharger network</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded border ${settings.services.ev ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-400 bg-gray-100 border-gray-200'}`}>
                                                {settings.services.ev ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.services.ev} onChange={(e) => setSettings({ ...settings, services: { ...settings.services, ev: e.target.checked } })} />
                                                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFB300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFB300]"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Maintenance Service */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#FFB300]/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm text-gray-600 group-hover:text-[#FFB300] transition-colors">
                                                <Wrench className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Fleet Maintenance</p>
                                                <p className="text-xs text-gray-500">On-site diagnostics</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">ACTIVE</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={settings.services.maintenance} onChange={(e) => setSettings({ ...settings, services: { ...settings.services, maintenance: e.target.checked } })} />
                                                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFB300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFB300]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Social Connect */}
                            <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="size-2.5 rounded-full bg-gray-400"></span>
                                    Social Connect
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#FFB300] focus-within:bg-white transition-all">
                                        <div className="h-full px-4 flex items-center justify-center bg-gray-100 border-r border-gray-200 text-gray-500">
                                            <span className="font-bold text-xs">IG</span>
                                        </div>
                                        <input
                                            className="bg-transparent border-none text-sm text-gray-800 px-4 py-3 w-full focus:ring-0 placeholder-gray-400 focus:outline-none"
                                            type="text"
                                            value={settings.socialInstagram || ""}
                                            onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#FFB300] focus-within:bg-white transition-all">
                                        <div className="h-full px-4 flex items-center justify-center bg-gray-100 border-r border-gray-200 text-gray-500">
                                            <span className="font-bold text-xs">LI</span>
                                        </div>
                                        <input
                                            className="bg-transparent border-none text-sm text-gray-800 px-4 py-3 w-full focus:ring-0 placeholder-gray-400 focus:outline-none"
                                            type="text"
                                            value={settings.socialLinkedin || ""}
                                            onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                                            placeholder="/company/name"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Save Button */}
                        <div className="fixed bottom-8 left-8 z-30">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#FFB300] hover:bg-[#F57F17] text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_14px_rgba(255,179,0,0.4)] flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                <span>{saved ? "Changes Saved!" : "Save Changes"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Live Preview */}
                    <div className="hidden lg:flex lg:w-2/5 border-l border-gray-200 relative bg-gray-50 flex-col items-center justify-center p-6 shadow-inner">
                        <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex gap-1">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold shadow-sm border border-gray-200 transition-all">
                                    <Smartphone className="w-4 h-4" />
                                    Mobile
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-500 rounded-lg text-xs font-bold transition-colors">
                                    <Monitor className="w-4 h-4" />
                                    Web
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-8 right-8 z-20">
                            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white text-green-600 border border-gray-200 flex items-center gap-2 shadow-sm">
                                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                LIVE PREVIEW
                            </span>
                        </div>

                        {/* Phone Frame */}
                        <div className="relative z-10 w-[340px] h-[680px] bg-white rounded-[3rem] border-4 border-gray-300 shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5 mt-10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-2xl z-50"></div>

                            {/* Status Bar */}
                            <div className="h-10 w-full bg-white/95 backdrop-blur-sm text-gray-900 flex items-end justify-between px-6 pb-2 text-[10px] font-medium z-40 absolute top-0 border-b border-gray-50">
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <Signal className="w-3 h-3" />
                                    <Wifi className="w-3 h-3" />
                                    <BatteryFull className="w-3 h-3" />
                                </div>
                            </div>

                            {/* Map App Header */}
                            <div className="absolute top-12 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
                                <button className="size-10 rounded-full bg-white flex items-center justify-center text-gray-800 border border-gray-100 shadow-lg pointer-events-auto hover:bg-gray-50">
                                    <Menu className="w-5 h-5" />
                                </button>
                                <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-md">
                                    <span className="text-gray-900 text-xs font-black tracking-widest uppercase"><span className="text-[#FFB300]">Go</span>Map</span>
                                </div>
                            </div>

                            {/* Map Background */}
                            <div className="flex-1 bg-slate-50 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute size-32 bg-[#FFB300]/10 rounded-full animate-ping"></div>
                                        <div className="absolute size-16 bg-[#FFB300]/20 rounded-full"></div>
                                        <div className="size-12 bg-white rounded-full border-2 border-[#FFB300] flex items-center justify-center shadow-xl z-10 relative">
                                            <Truck className="w-5 h-5 text-[#FFB300]" />
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                                                Unit #42
                                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Sheet */}
                            <div className="w-full bg-white rounded-t-[2rem] p-6 flex flex-col justify-between border-t border-gray-100 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-8">
                                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h4 className="text-gray-900 font-bold text-lg">Delivery in 15m</h4>
                                        <p className="text-gray-500 text-xs mt-0.5">Arriving at Headquarters</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[#FFB300] font-black text-xl">$45.00</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                        <Fuel className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                            <span>FUEL LEVEL</span>
                                            <span>75%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-[#FFB300] rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-900 font-bold font-mono">750L</span>
                                </div>
                                <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                    <span>Request Delivery</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-50"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
