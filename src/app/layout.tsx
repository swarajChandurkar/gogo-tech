import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { LangProvider } from "@/context/LangContext";
import { GoogleTagManager } from "@next/third-parties/google";
import FuelTicker from "@/components/FuelTicker";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | GoGo Imperial Energy",
    default: "GoGo Imperial Energy | Premium Fuel Delivery in Benin",
  },
  description: "B2B and B2C on-demand fuel delivery in Cotonou. Diesel and Super gasoline delivered to your fleet or home. Tracking, safety, and reliability guaranteed.",
  metadataBase: new URL("https://gogo.bj"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: "https://gogo.bj",
    siteName: "GoGo Imperial Energy",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GoGo Fuel Delivery",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness Schema (Expanded with Organization)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://gogo.bj/#organization",
    "name": "GoGo Imperial Energy",
    "url": "https://gogo.bj",
    "logo": "https://gogo.bj/assets/images/logo-main.png",
    "sameAs": [
      "https://facebook.com/gogoimperial",
      "https://twitter.com/gogoimperial",
      "https://linkedin.com/company/gogo-imperial"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+229 XX XX XX XX",
      "contactType": "customer service",
      "areaServed": "BJ",
      "availableLanguage": ["English", "French"]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "parentOrganization": {
      "@id": "https://gogo.bj/#organization"
    },
    "name": "GoGo Imperial Energy Cotonou",
    "description": "Smart fuel delivery for businesses and individuals.",
    "url": "https://gogo.bj",
    "telephone": "+229 XX XX XX XX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cotonou",
      "addressCountry": "BJ"
    },
    "areaServed": {
      "@type": "City",
      "name": "Cotonou, Benin"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "currenciesAccepted": "XOF",
    "paymentAccepted": "Cash, Credit Card, Mobile Money"
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "On-Site Fuel Delivery",
    "description": "Professional fuel delivery directly to your fleet location. Diesel and Super gasoline available 24/7.",
    "provider": {
      "@id": "https://gogo.bj/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Cotonou, Benin"
    },
    "serviceType": "Fuel Delivery"
  };

  return (
    <html lang="fr" className={dmSans.variable}>
      <head>
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900 font-sans">
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-MOCK'} />

        {/* LinkedIn Insight Tag - Lazy Load */}
        <Script id="linkedin-insight" strategy="lazyOnload">
          {`
            _linkedin_partner_id = "LINKEDIN-PARTNER-ID";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </Script>

        {/* Meta Pixel - Lazy Load */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'META-PIXEL-ID');
            fbq('track', 'PageView');
          `}
        </Script>

        <Suspense fallback={null}>
          <LangProvider>
            <FuelTicker />
            {children}
          </LangProvider>
        </Suspense>
      </body>
    </html>
  );
}
