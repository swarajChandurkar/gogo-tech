"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<"loading" | "merging" | "done">("loading");

    useEffect(() => {
        const duration = 2000; // 2 seconds loading
        const interval = 20;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    // Start merge animation
                    setTimeout(() => setPhase("merging"), 200);
                    // Complete after merge animation
                    setTimeout(() => {
                        setPhase("done");
                        onComplete();
                    }, 1200);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    // Calculate animation values based on phase
    const getLogoAnimation = () => {
        if (phase === "loading") {
            return { scale: 1, x: 0, y: 0, opacity: 1 };
        }
        if (phase === "merging") {
            // Move to top-left navbar position
            return {
                scale: 0.4,
                x: "-40vw",
                y: "-40vh",
                opacity: 1
            };
        }
        return { scale: 0.4, x: "-40vw", y: "-40vh", opacity: 0 };
    };

    if (phase === "done") return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{
                opacity: 1,
                backgroundColor: phase === "merging" ? "rgba(0,0,0,0)" : "rgba(0,0,0,1)"
            }}
            transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
            style={{ backgroundColor: phase === "loading" ? "#000" : "transparent" }}
        >
            {/* Logo Container with Merge Animation */}
            <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                animate={getLogoAnimation()}
                transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                }}
            >
                {/* Logo Image + Text Row - Centered together */}
                <motion.div
                    className="flex items-center justify-center gap-3"
                    animate={{
                        gap: phase === "merging" ? "8px" : "12px",
                    }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    {/* Droplet Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0"
                    >
                        <Image
                            src="/assets/images/logo-main.png"
                            alt="GoGo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>

                    {/* GOGO Text with Reveal Effect */}
                    <div className="relative overflow-hidden">
                        {/* Revealed text (clipped) */}
                        <motion.span
                            className="text-5xl md:text-7xl font-bold text-white tracking-wide block"
                            style={{
                                clipPath: `inset(0 ${100 - progress}% 0 0)`,
                            }}
                        >
                            GOGO
                        </motion.span>
                        {/* Ghost text outline for layout */}
                        <span
                            className="text-5xl md:text-7xl font-bold tracking-wide absolute inset-0"
                            style={{
                                WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                                color: "transparent"
                            }}
                        >
                            GOGO
                        </span>
                    </div>
                </motion.div>

                {/* Tagline - fades in mid-progress, fades out on merge */}
                <AnimatePresence>
                    {phase === "loading" && progress > 40 && (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 0.6, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.4 }}
                            className="text-gray-400 text-xs tracking-[0.25em] uppercase mt-4"
                        >
                            Imperial Energy
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Progress Bar - matches width of GOGO text approximately */}
                <AnimatePresence>
                    {phase === "loading" && (
                        <motion.div
                            initial={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8"
                            style={{ width: "220px" }} // Fixed width to match GOGO text
                        >
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Percentage - bottom corner during loading */}
            <AnimatePresence>
                {phase === "loading" && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6 text-gray-600 text-xs font-mono"
                    >
                        {Math.round(progress)}%
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
