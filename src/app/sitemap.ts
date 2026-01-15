import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogo.bj';
const locales = ['en', 'fr'] as const;

// Static routes
const staticRoutes = ['', '/quote'];

// Blog posts (would be fetched from CMS in production)
const blogSlugs = [
    'on-demand-fuel-delivery-benin',
    'fleet-manager-time-savings',
    'mobile-fueling-vs-stations',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    // Add localized static routes
    for (const route of staticRoutes) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en${route}`,
                        fr: `${baseUrl}/fr${route}`,
                    },
                },
            });
        }
    }

    // Add blog index
    for (const locale of locales) {
        entries.push({
            url: `${baseUrl}/${locale}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/blog`,
                    fr: `${baseUrl}/fr/blog`,
                },
            },
        });
    }

    // Add blog posts
    for (const slug of blogSlugs) {
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}/blog/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en/blog/${slug}`,
                        fr: `${baseUrl}/fr/blog/${slug}`,
                    },
                },
            });
        }
    }

    return entries;
}
