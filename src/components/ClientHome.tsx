"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import B2BSolutions from "@/components/B2BSolutions";
import AppSection from "@/components/AppSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

interface HomeContent {
    hero: {
        title: { en: string; fr: string };
        subtitle: { en: string; fr: string };
        image: string;
    };
}

export default function ClientHome({ content }: { content: HomeContent }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            {!isLoading && (
                <main className="min-h-screen bg-white text-slate-900">
                    <Navbar />
                    <Hero cmsContent={content.hero} />
                    <TrustStrip />
                    <B2BSolutions />
                    <AppSection />
                    <FAQ />
                    <Footer />
                </main>
            )}
        </>
    );
}
