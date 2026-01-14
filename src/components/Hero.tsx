"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
    return (
        <header className="relative w-full flex flex-col items-center">
            {/* Hero Background & Main Content */}
            <div className="w-full h-[640px] relative bg-slate-900 overflow-hidden rounded-b-[40px] sm:rounded-b-[60px] mx-auto max-w-[1440px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/assets/images/hero-fueling.jpg"
                        alt="Modern fuel truck on highway"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                {/* Hero Content */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center pb-32">
                    {/* Expanding Badge */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Now expanding in Montreal</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mb-6 drop-shadow-sm">
                        We <span className="text-primary italic">Go</span> to your location,<br /> so you keep going.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-medium">
                        The smart fuel delivery and vehicle service network for modern fleets and busy individuals.
                    </p>
                </div>
            </div>

            {/* Overlapping Cards Container */}
            <div className="relative w-full max-w-7xl mx-auto px-6 -mt-24 md:-mt-32 z-20 pb-16">
                <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
                    {/* Card A: B2B */}
                    <div className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <div className="w-full md:w-1/2 h-48 rounded-2xl overflow-hidden relative">
                            <Image
                                src="/assets/images/b2b-driver.jpg"
                                alt="Fleet of delivery vans"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="flex-1 flex flex-col items-start text-left w-full">
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">For Business</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">Fleet Management & Partnerships</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Fueling, analytics, and maintenance solutions tailored for corporate fleets.</p>
                            <Link
                                href="/quote"
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#d65a15] transition-colors shadow-lg shadow-accent/20"
                            >
                                Request Quote
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Card B: B2C */}
                    <div className="group bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <div className="w-full md:w-1/2 h-48 rounded-2xl overflow-hidden relative">
                            <Image
                                src="/assets/images/contact-team.jpg"
                                alt="Person using mobile app"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="flex-1 flex flex-col items-start text-left w-full">
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">For Individuals</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">Mobile App Delivery</h3>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Get fuel, car wash, and service delivered to your driveway or office.</p>
                            <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-200 px-6 py-3 rounded-full text-sm font-bold hover:border-primary hover:bg-primary/5 transition-colors">
                                <Download className="w-5 h-5" />
                                Download App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
