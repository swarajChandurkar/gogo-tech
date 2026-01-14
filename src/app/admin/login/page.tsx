"use client";

import { useState } from "react";
import { loginAdmin } from "./actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await loginAdmin(passcode);

        if (result.success) {
            router.push("/admin");
        } else {
            setError("Invalid access code.");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image src="/assets/icons/logo.svg" alt="GoGo" width={32} height={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
                    <p className="text-slate-500 text-sm mt-2">Enter your security code to view leads.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full text-center text-2xl tracking-widest px-4 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-mono"
                            placeholder="••••••"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </main>
    );
}
