import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LangProvider } from "@/context/LangContext";
import { GoogleTagManager } from "@next/third-parties/google";
import FuelTicker from "@/components/FuelTicker";
import { Suspense } from "react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOGO IMPERIAL ENERGY",
  description: "Smart fuel delivery for business and individuals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "name": "GoGo Imperial Energy",
    "description": "Smart fuel delivery for business and individuals.",
    "areaServed": {
      "@type": "City",
      "name": "Cotonou, Benin"
    },
    "url": "https://gogo.bj",
    "openingHours": "Mo-Su 00:00-23:59",
    "currenciesAccepted": "XOF",
    "paymentAccepted": "Cash, Credit Card, Mobile Money"
  };

  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} antialiased bg-white text-slate-900 font-sans`}
      >
        <GoogleTagManager gtmId="GTM-XXXXXX" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <FuelTicker />

        <Suspense fallback={null}>
          <LangProvider>
            {children}
          </LangProvider>
        </Suspense>
      </body>
    </html>
  );
}
