"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLang } from "@/context/LangContext";

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useLang();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Apply spring physics for smooth, weighted motion
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Truck movement: starts off-screen left, drives to right side
    const truckX = useTransform(smoothProgress, [0, 0.5, 1], ["-100%", "0%", "100%"]);

    // Text opacity transitions
    const text1Opacity = useTransform(smoothProgress, [0, 0.2, 0.35], [0, 1, 0]);
    const text2Opacity = useTransform(smoothProgress, [0.35, 0.5, 1], [0, 1, 1]);
    const pumpOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
    const pumpY = useTransform(smoothProgress, [0.4, 0.6], [30, 0]);

    return (
        <section ref={containerRef} className="relative h-[300vh] z-10 bg-white">
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                <div className="container mx-auto px-6 relative w-full h-full flex items-center">

                    {/* Left: Text Content */}
                    <div className="relative z-20 w-full md:w-1/2 flex flex-col justify-center">
                        {/* Step 1: Running Low? */}
                        <motion.div
                            style={{ opacity: text1Opacity }}
                            className="absolute inset-0 flex flex-col justify-center"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold text-black mb-4">
                                {t.howItWorks.step1Title} <span className="text-secondary">{t.howItWorks.step1Highlight}</span>
                            </h2>
                            <p className="text-xl text-gray-600">
                                {t.howItWorks.step1Desc}
                            </p>
                        </motion.div>

                        {/* Step 2: We Come To You */}
                        <motion.div
                            style={{ opacity: text2Opacity }}
                            className="flex flex-col justify-center"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold text-black mb-4">
                                {t.howItWorks.step2Title} <span className="text-primary">{t.howItWorks.step2Highlight}</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                {t.howItWorks.step2Desc}
                            </p>

                            {/* Floating Pump */}
                            <motion.div
                                style={{ opacity: pumpOpacity, y: pumpY }}
                                className="relative w-32 h-32 md:w-48 md:h-48"
                            >
                                <Image
                                    src="/assets/images/gogo-pump-float.png"
                                    alt="Fuel Pump Nozzle"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right: Truck (Desktop Only) - Drives across screen */}
                    <motion.div
                        style={{ x: truckX }}
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-auto z-10"
                    >
                        <div className="relative w-full aspect-[4/3]">
                            <Image
                                src="/assets/images/gogo-truck-side.png"
                                alt="GoGo Fuel Truck"
                                fill
                                className="object-contain object-right"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile: Static Stacked Layout */}
            <div className="md:hidden absolute bottom-20 left-0 right-0 px-6 z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-64"
                >
                    <Image
                        src="/assets/images/gogo-truck-side.png"
                        alt="GoGo Fuel Truck"
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </div>
        </section>
    );
}
