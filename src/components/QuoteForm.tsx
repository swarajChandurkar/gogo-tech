"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitQuote } from "@/app/actions";
import { QuoteData } from "@/lib/quote-types";
import { sendGTMEvent } from "@next/third-parties/google";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

// Client-side schema mirroring server-side for immediate feedback
const formSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    fleetSize: z.enum(["1-10", "11-50", "50+"], { errorMap: () => ({ message: "Please select a fleet size" }) }),
    fuelType: z.enum(["Diesel", "Super", "Both"], { errorMap: () => ({ message: "Please select fuel type" }) }),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function QuoteForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setServerError(null);

        try {
            const result = await submitQuote(data as QuoteData);

            if (result.success) {
                setSubmitted(true);
                // Trigger GTM event
                if (typeof window !== 'undefined') {
                    sendGTMEvent({ event: "Lead_Generation", value: data.fleetSize });
                }
                reset();
            } else {
                setServerError("There was an issue processing your request. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setServerError("An unexpected error occurred. Please try again.");
        }

        setIsSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Quote Requested!</h3>
                <p className="text-slate-600">
                    Our sales team will contact you within 2 business hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-green-700 font-semibold hover:underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            {serverError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                    {serverError}
                </div>
            )}

            {/* Company Name */}
            <div>
                <label htmlFor="companyName" className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                <input
                    {...register("companyName")}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-primary/50"} focus:border-primary focus:outline-none transition-all`}
                    placeholder="e.g. Imperial Logistics"
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.companyName.message}</p>}
            </div>

            {/* Fleet Size & Fuel Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Fleet Size</label>
                    <select
                        {...register("fleetSize")}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fleetSize ? "border-red-500" : "border-gray-200"} focus:border-primary focus:ring-primary/50 focus:outline-none bg-white transition-all`}
                    >
                        <option value="">Select size...</option>
                        <option value="1-10">1-10 Vehicles</option>
                        <option value="11-50">11-50 Vehicles</option>
                        <option value="50+">50+ Vehicles</option>
                    </select>
                    {errors.fleetSize && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fleetSize.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Fuel</label>
                    <select
                        {...register("fuelType")}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fuelType ? "border-red-500" : "border-gray-200"} focus:border-primary focus:ring-primary/50 focus:outline-none bg-white transition-all`}
                    >
                        <option value="">Select fuel...</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Super">Super (Gasoline)</option>
                        <option value="Both">Both</option>
                    </select>
                    {errors.fuelType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fuelType.message}</p>}
                </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-200"} focus:border-primary focus:ring-primary/50 focus:outline-none transition-all`}
                        placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        {...register("phone")}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-500" : "border-gray-200"} focus:border-primary focus:ring-primary/50 focus:outline-none transition-all`}
                        placeholder="+229 00 00 00 00"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Get Custom Quote"
                )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">
                By submitting, you agree to receive commercial communications from GoGo Imperial Energy.
            </p>
        </form>
    );
}
