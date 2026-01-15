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

// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "@id": "https://gogo.bj/#organization",
    "name": "GoGo Imperial Energy",
    "description": "Smart fuel delivery for businesses and individuals in Benin.",
    "url": "https://gogo.bj",
    "logo": "https://gogo.bj/assets/images/logo-main.png",
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
      "@type": "LocalBusiness",
      "@id": "https://gogo.bj/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Cotonou, Benin"
    },
    "serviceType": "Fuel Delivery"
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does GoGo fuel delivery work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply request fuel through our app or website, and our certified drivers will deliver directly to your location."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently serve Cotonou and surrounding areas in Benin, with expansion plans underway."
        }
      },
      {
        "@type": "Question",
        "name": "What fuel types are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer both Super (Gasoline) and Diesel at government-regulated prices."
        }
      }
    ]
  };

  return (
    <html lang="fr">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://gogo.bj" />

        {/* hreflang tags for language alternates */}
        <link rel="alternate" hrefLang="en" href="https://gogo.bj?lang=en" />
        <link rel="alternate" hrefLang="fr" href="https://gogo.bj?lang=fr" />
        <link rel="alternate" hrefLang="x-default" href="https://gogo.bj" />

        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body
        className={`${dmSans.variable} antialiased bg-white text-slate-900 font-sans`}
      >
        {/* Google Tag Manager - Keep early load */}
        <GoogleTagManager gtmId="GTM-XXXXXX" />

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
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} alt=""
            src="https://px.ads.linkedin.com/collect/?pid=LINKEDIN-PARTNER-ID&fmt=gif" />
        </noscript>

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
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=META-PIXEL-ID&ev=PageView&noscript=1" />
        </noscript>

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
