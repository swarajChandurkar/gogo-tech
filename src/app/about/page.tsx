"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OriginStory from "@/components/OriginStory";
import TeamGrid from "@/components/TeamGrid";
import aboutData from "@/content/about-data.json";
import { useLang } from "@/context/LangContext";

// Metadata not supported in client component
// export const metadata: Metadata = { ... }

export default function AboutPage() {
    const { t } = useLang();

    const pillars = [
        {
            icon: Shield,
            title: t.aboutPage.metrics.safety.title,
            description: t.aboutPage.metrics.safety.desc,
        },
        {
            icon: Users,
            title: t.aboutPage.metrics.community.title,
            description: t.aboutPage.metrics.community.desc,
        },
        {
            icon: Zap,
            title: t.aboutPage.metrics.innovation.title,
            description: t.aboutPage.metrics.innovation.desc,
        },
    ];

    return (
        <>
            <Navbar />

            <main id="main-content">
                {/* Hero Section */}
                <section className="bg-slate-900 text-white py-24">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                            {t.aboutPage.ourStory}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            {t.aboutPage.heroTitle}<br />
                            <span className="text-primary italic">{t.aboutPage.heroSuffix}</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            {t.aboutPage.heroDesc}
                        </p>
                    </div>
                </section>

                {/* Mission Pillars */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                                {t.aboutPage.driversTitle}
                            </h2>
                            <p className="text-slate-600 max-w-xl mx-auto">
                                {t.aboutPage.driversDesc}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {pillars.map((pillar) => {
                                const Icon = pillar.icon;
                                return (
                                    <div
                                        key={pillar.title}
                                        className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100"
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Icon className="w-8 h-8 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-slate-600">{pillar.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Origin Story Timeline */}
                <OriginStory milestones={aboutData.milestones} />

                {/* Team Grid */}
                <TeamGrid members={aboutData.team} />

                {/* CTA Section */}
                <section className="py-16 bg-slate-900">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            {t.aboutPage.join.title}
                        </h2>
                        <p className="text-slate-400 mb-8">
                            {t.aboutPage.join.desc}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/quote"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors"
                            >
                                {t.aboutPage.join.partner}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="mailto:careers@gogo.bj"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20"
                            >
                                {t.aboutPage.join.careers}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
