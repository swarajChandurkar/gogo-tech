/**
 * Admin Login Page
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("sent");
                setMessage(data.message);

                // Development: auto-redirect if debug link present
                if (data.debug_link) {
                    setMessage(`Development mode: Check console for magic link`);
                    console.log("Magic link:", data.debug_link);
                }
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to send login link");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">GoGo CMS</h1>
                    <p className="text-slate-500 mt-2">Admin Login</p>
                </div>

                {status === "sent" ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-slate-600">{message}</p>
                        <p className="text-sm text-slate-400 mt-4">Check your email for the login link.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gogo.bj"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {status === "error" && (
                            <div className="text-center text-red-500 text-sm">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {status === "loading" ? "Sending..." : "Send Login Link"}
                        </button>
                    </form>
                )}

                <p className="text-center text-xs text-slate-400 mt-6">
                    Protected admin area. Authorized users only.
                </p>
            </div>
        </div>
    );
}
