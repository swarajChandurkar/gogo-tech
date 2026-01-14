"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Lang = "EN" | "FR";

interface LangContextType {
    lang: Lang;
    toggleLang: () => void;
    t: (en: string, fr: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
    // Default to French as per brand requirements
    const [lang, setLang] = useState<Lang>("FR");
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const langParam = searchParams.get("lang");
        if (langParam === "en" || langParam === "EN") {
            setLang("EN");
        } else if (langParam === "fr" || langParam === "FR") {
            setLang("FR");
        }
        // If no param, stays as default (FR)
    }, [searchParams]);

    const toggleLang = () => {
        const newLang = lang === "EN" ? "FR" : "EN";
        setLang(newLang);

        const params = new URLSearchParams(searchParams.toString());
        params.set("lang", newLang.toLowerCase());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Simple translation helper
    const t = (en: string, fr: string) => (lang === "EN" ? en : fr);

    return (
        <LangContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = useContext(LangContext);
    if (!context) {
        throw new Error("useLang must be used within a LangProvider");
    }
    return context;
}
