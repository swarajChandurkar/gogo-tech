import Navbar from "@/components/Navbar";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function QuotePage() {
    return (
        <main className="min-h-screen bg-neutral-surface font-sans">
            <Navbar />

            <div className="relative pt-12 pb-24 px-6">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-slate-900 rounded-b-[60px] overflow-hidden -z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                    <Image
                        src="/assets/images/b2b-driver.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb / Back */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-white/80 hover:text-primary transition-colors text-sm font-bold"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column: Value Prop */}
                        <div className="text-white space-y-6 pt-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                                Fuel your fleet efficiently in <span className="text-primary">Benin.</span>
                            </h1>
                            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                                Join over 500+ corporate partners who trust GoGo for reliable on-site fueling, maintenance, and detailed consumption analytics.
                            </p>

                            <ul className="space-y-4 mt-8">
                                {[
                                    "Save ~15% on operational costs",
                                    "Real-time digital receipts",
                                    "24/7 Priority Support",
                                    "Net-30 Payment Terms available"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="font-semibold text-slate-100">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-8">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 inline-block">
                                    <p className="text-primary font-extrabold text-2xl mb-1">4.9/5</p>
                                    <p className="text-xs text-white/60 font-medium tracking-wider uppercase">Partner Satisfaction</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="lg:mt-0">
                            <QuoteForm />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
