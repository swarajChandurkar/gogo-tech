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
                scale: 0.25,
                x: "-42vw", // Move to left edge (navbar logo position)
                y: "-42vh", // Move to top
                opacity: 1
            };
        }
        return { scale: 0.25, x: "-42vw", y: "-42vh", opacity: 0 };
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
                {/* Logo Image + Text Row */}
                <motion.div
                    className="flex items-center gap-2"
                    animate={{
                        gap: phase === "merging" ? "4px" : "8px",
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
                        className="relative w-10 h-10 md:w-14 md:h-14"
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
                            className="text-5xl md:text-7xl font-bold text-white tracking-wide"
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

                {/* Progress Bar - only during loading */}
                <AnimatePresence>
                    {phase === "loading" && (
                        <motion.div
                            initial={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-40 md:w-56 h-0.5 bg-gray-800 rounded-full overflow-hidden mt-6"
                        >
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${progress}%` }}
                            />
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
