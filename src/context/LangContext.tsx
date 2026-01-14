"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Lang = 'EN' | 'FR';

interface LangContextType {
    lang: Lang;
    toggleLang: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('EN');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Sync state with URL query param on mount/update
    useEffect(() => {
        const langParam = searchParams.get('lang');
        if (langParam === 'fr' || langParam === 'FR') {
            setLang('FR');
        } else if (langParam === 'en' || langParam === 'EN') {
            setLang('EN');
        }
    }, [searchParams]);

    const toggleLang = () => {
        const newLang = lang === 'EN' ? 'FR' : 'EN';
        setLang(newLang);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', newLang.toLowerCase());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <LangContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = useContext(LangContext);
    if (context === undefined) {
        throw new Error('useLang must be used within a LangProvider');
    }
    return context;
}
