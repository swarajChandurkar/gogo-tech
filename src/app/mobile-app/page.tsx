"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppFeatures from "@/components/AppFeatures";
import HowItWorks from "@/components/HowItWorks";
import QRDownload from "@/components/QRDownload";
import appFeaturesData from "@/content/app-features.json";
import { useLang } from "@/context/LangContext";

// Metadata not supported in client component
// export const metadata: Metadata = { ... }

export default function MobileAppPage() {
    const { t } = useLang();

    return (
        <>
            <Navbar />

            <main id="main-content">
                {/* Hero Section */}
                <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div
                            style={{
                                backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
                                backgroundSize: "24px 24px",
                            }}
                            className="w-full h-full"
                        ></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                            {t.heroExpanded.forIndividuals}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            {t.app.title} <span className="text-primary italic">{t.app.titleHighlight}</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            {t.app.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#download"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg"
                            >
                                {t.heroExpanded.getApp}
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20"
                            >
                                {t.common.seeFeatures}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <AppFeatures features={appFeaturesData.features} />

                {/* How It Works */}
                <HowItWorks steps={appFeaturesData.howItWorks} />

                {/* QR Download Section */}
                <QRDownload />

                {/* CTA Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            {t.support.title}
                        </h2>
                        <p className="text-slate-600 mb-8">
                            {t.support.subtitle}
                        </p>
                        <Link
                            href="/quote"
                            className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-[#d65a15] transition-colors"
                        >
                            {t.support.cta}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
