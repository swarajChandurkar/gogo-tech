"use client";

import Image from "next/image";
import { Truck } from "lucide-react";
import { trackAppDownload } from "@/lib/analytics";

export default function AppSection() {
    const handleAppStoreClick = () => {
        trackAppDownload("ios");
        // Add actual App Store link here
        window.open("https://apps.apple.com", "_blank");
    };

    const handlePlayStoreClick = () => {
        trackAppDownload("android");
        // Add actual Play Store link here
        window.open("https://play.google.com", "_blank");
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-slate-900 rounded-[48px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    ></div>

                    {/* Left Content */}
                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Fueling your life <br /><span className="text-primary">on demand.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto md:mx-0">
                            Skip the gas station. Order fuel, wash, and service with a tap. Available now in your city.
                        </p>

                        {/* App Store Buttons with Tracking */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleAppStoreClick}
                                className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase font-medium text-slate-500">Download on the</span>
                                    <span className="text-sm">App Store</span>
                                </div>
                            </button>

                            <button
                                onClick={handlePlayStoreClick}
                                className="flex items-center justify-center gap-3 bg-slate-800 text-white border border-slate-700 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
                                </svg>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase font-medium text-slate-400">Get it on</span>
                                    <span className="text-sm">Google Play</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Phone Mockup */}
                    <div className="flex-1 flex justify-center items-end relative z-10 -mb-24 md:-mb-32">
                        <div className="relative w-[280px] md:w-[320px] aspect-[9/19] bg-slate-800 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden">
                            {/* App Screen Mock */}
                            <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                        <Truck className="w-8 h-8 text-black" />
                                    </div>
                                    <p className="text-white font-bold">GoGo App</p>
                                    <p className="text-slate-400 text-sm mt-1">Track your delivery</p>
                                </div>
                            </div>

                            {/* App UI Overlay */}
                            <div className="absolute bottom-0 inset-x-0 bg-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Estimated Arrival</p>
                                        <p className="text-lg font-bold text-slate-900">14:30 PM</p>
                                    </div>
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-accent rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
