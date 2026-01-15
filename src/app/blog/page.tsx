/**
 * Blog Index Page
 */

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | GoGo Imperial Energy',
    description: 'Insights on fuel delivery, fleet management, and energy solutions in Benin.',
    openGraph: {
        title: 'Blog | GoGo Imperial Energy',
        description: 'Insights on fuel delivery, fleet management, and energy solutions.',
        type: 'website',
    },
};

// Blog posts data (would come from CMS in production)
const posts = [
    {
        slug: 'on-demand-fuel-delivery-benin',
        title: 'On-Demand Fuel Delivery: How It Works in Benin',
        excerpt: 'Discover how mobile fueling is transforming fleet operations across Cotonou and beyond.',
        date: '2026-01-15',
        readTime: '5 min read',
    },
    {
        slug: 'fleet-manager-time-savings',
        title: '5 Ways Fleet Managers Save Time with GoGo',
        excerpt: 'From eliminating gas station trips to automated invoicing, here\'s how our platform helps.',
        date: '2026-01-10',
        readTime: '4 min read',
    },
    {
        slug: 'mobile-fueling-vs-stations',
        title: 'Why Businesses Choose Mobile Fueling Over Stations',
        excerpt: 'The economics and logistics that make on-site fuel delivery the smart choice.',
        date: '2026-01-05',
        readTime: '6 min read',
    },
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">GoGo Blog</h1>
                    <p className="text-xl text-slate-300">
                        Insights on fuel delivery, fleet management, and energy in Africa.
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <div className="flex flex-col gap-8">
                    {posts.map((post) => (
                        <article key={post.slug} className="group">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-tech hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                        <time dateTime={post.date}>
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed">{post.excerpt}</p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-600 mb-4">Ready to optimize your fleet?</p>
                    <Link
                        href="/quote"
                        className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-[#d65a15] transition-colors"
                    >
                        Request a Quote
                    </Link>
                </div>
            </section>
        </main>
    );
}
