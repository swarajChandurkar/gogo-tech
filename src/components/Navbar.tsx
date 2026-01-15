"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { businessPortalUrl } from "@/lib/fuel-config";
import { useLang } from "@/context/LangContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { lang, toggleLang, t } = useLang();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#services", label: t.nav.services },
        { href: "#about", label: t.nav.about },
        { href: "#safety", label: t.nav.safety },
        { href: businessPortalUrl, label: t.nav.login, external: true },
    ];

    return (
        <>
            {/* Sticky White Navbar */}
            <nav
                className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden relative">
                            <Image
                                src="/assets/images/logo-main.png"
                                alt="GoGo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">GoGo</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.external ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                        <span className="h-4 w-px bg-slate-300"></span>
                        <button
                            onClick={toggleLang}
                            className="text-sm font-bold text-slate-900 hover:text-primary transition-colors"
                        >
                            {lang === "EN" ? "EN" : "FR"} | {lang === "EN" ? "FR" : "EN"}
                        </button>
                    </div>

                    {/* CTA & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/quote"
                            className="hidden sm:flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {t.nav.quote}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-900"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            link.external ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-900 text-lg font-semibold hover:text-primary transition-colors py-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-900 text-lg font-semibold hover:text-primary transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                        <button
                            onClick={() => {
                                toggleLang();
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 text-slate-600 py-2"
                        >
                            <span className={lang === "EN" ? "text-primary font-bold" : ""}>English</span>
                            <span>/</span>
                            <span className={lang === "FR" ? "text-primary font-bold" : ""}>Français</span>
                        </button>
                        <Link
                            href="/quote"
                            onClick={() => setMobileMenuOpen(false)}
                            className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold text-center"
                        >
                            {t.nav.quote}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
