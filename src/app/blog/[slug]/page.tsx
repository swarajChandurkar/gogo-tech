/**
 * Blog Post Page
 */

import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Blog posts data (would come from CMS in production)
const posts: Record<string, {
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    readTime: string;
    canonical: string;
    relatedSlugs: string[];
}> = {
    'on-demand-fuel-delivery-benin': {
        title: 'On-Demand Fuel Delivery: How It Works in Benin',
        excerpt: 'Discover how mobile fueling is transforming fleet operations across Cotonou and beyond.',
        content: `
## The Rise of Mobile Fueling

In Benin's rapidly growing economy, fleet operators face a common challenge: keeping vehicles fueled efficiently. Traditional gas station visits consume valuable time and create scheduling headaches.

GoGo Imperial Energy solves this with on-demand fuel delivery directly to your location—whether that's a construction site, warehouse, or office parking lot.

## How It Works

1. **Request**: Open the GoGo app or website and enter your fuel needs
2. **Schedule**: Choose immediate delivery or schedule for a specific time
3. **Deliver**: Our certified drivers bring fuel directly to your vehicles
4. **Track**: Receive real-time updates and digital receipts

## Benefits for Benin Businesses

- **Time Savings**: Eliminate 30+ minutes per vehicle per week
- **Cost Control**: Government-regulated pricing with no hidden fees
- **Safety**: ADR-certified trucks and trained drivers
- **Analytics**: Track consumption patterns across your fleet

## Ready to Get Started?

Join 500+ businesses in Cotonou already using GoGo for smarter fueling.
    `,
        date: '2026-01-15',
        author: 'GoGo Team',
        readTime: '5 min read',
        canonical: 'https://gogo.bj/blog/on-demand-fuel-delivery-benin',
        relatedSlugs: ['fleet-manager-time-savings', 'mobile-fueling-vs-stations'],
    },
    'fleet-manager-time-savings': {
        title: '5 Ways Fleet Managers Save Time with GoGo',
        excerpt: 'From eliminating gas station trips to automated invoicing, here\'s how our platform helps.',
        content: `
## Time Is Money—Especially for Fleet Managers

Managing a fleet in Benin means juggling drivers, maintenance, routes, and fuel. GoGo takes one major task off your plate.

## 1. No More Gas Station Detours

Your drivers stay on their routes while we bring fuel to your depot. Average time saved: 45 minutes per vehicle per week.

## 2. Automated Digital Receipts

Every delivery generates a digital receipt automatically synced to your dashboard. No more collecting paper slips.

## 3. Consumption Analytics

See exactly how much fuel each vehicle uses. Identify inefficiencies and optimize your fleet.

## 4. Flexible Scheduling

Schedule deliveries during off-hours when vehicles are parked. Fueling happens while you're not even working.

## 5. Consolidated Invoicing

One monthly invoice for all fuel across your entire fleet. Simplify accounting and reduce paperwork.

## Start Saving Time Today

Request a custom quote and see how much time your team could reclaim.
    `,
        date: '2026-01-10',
        author: 'GoGo Team',
        readTime: '4 min read',
        canonical: 'https://gogo.bj/blog/fleet-manager-time-savings',
        relatedSlugs: ['on-demand-fuel-delivery-benin', 'mobile-fueling-vs-stations'],
    },
    'mobile-fueling-vs-stations': {
        title: 'Why Businesses Choose Mobile Fueling Over Stations',
        excerpt: 'The economics and logistics that make on-site fuel delivery the smart choice.',
        content: `
## The Traditional Problem

Gas stations are designed for individual consumers, not business fleets. Long lines, inconsistent availability, and time wasted in transit add up.

## The Mobile Fueling Advantage

### Cost Comparison

| Factor | Gas Station | GoGo Mobile |
|--------|-------------|-------------|
| Fuel Price | Market rate | Same rate |
| Time Cost | 30-60 min | 0 min |
| Driver Productivity | Lost | Maintained |
| Receipt Management | Manual | Automatic |

### Operational Benefits

1. **Predictable Scheduling**: Know exactly when fuel arrives
2. **Bulk Efficiency**: Fuel multiple vehicles in one stop
3. **Safety Compliance**: Our trucks meet international standards
4. **Environmental**: Optimized routes mean fewer emissions

## The Bottom Line

For fleets of 10+ vehicles, mobile fueling typically saves 15% on operational costs when accounting for driver time.

## Make the Switch

See how GoGo can transform your fleet operations. Request a quote today.
    `,
        date: '2026-01-05',
        author: 'GoGo Team',
        readTime: '6 min read',
        canonical: 'https://gogo.bj/blog/mobile-fueling-vs-stations',
        relatedSlugs: ['on-demand-fuel-delivery-benin', 'fleet-manager-time-savings'],
    },
};

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} | GoGo Blog`,
        description: post.excerpt,
        alternates: {
            canonical: post.canonical,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export async function generateStaticParams() {
    return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        notFound();
    }

    const relatedPosts = post.relatedSlugs
        .map((s) => posts[s])
        .filter(Boolean);

    return (
        <main className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <nav className="max-w-4xl mx-auto px-6 py-4">
                <ol className="flex items-center gap-2 text-sm text-slate-500" itemScope itemType="https://schema.org/BreadcrumbList">
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link href="/" itemProp="item" className="hover:text-slate-900">
                            <span itemProp="name">Home</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </li>
                    <span>/</span>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link href="/blog" itemProp="item" className="hover:text-slate-900">
                            <span itemProp="name">Blog</span>
                        </Link>
                        <meta itemProp="position" content="2" />
                    </li>
                    <span>/</span>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name" className="text-slate-900 font-medium">{post.title}</span>
                        <meta itemProp="position" content="3" />
                    </li>
                </ol>
            </nav>

            {/* Article */}
            <article className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {post.title}
                    </h1>
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none">
                    {post.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                            return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                        }
                        if (line.startsWith('### ')) {
                            return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('1. ') || line.startsWith('- ')) {
                            return <p key={i} className="ml-4 mb-2">{line}</p>;
                        }
                        if (line.trim()) {
                            return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{line}</p>;
                        }
                        return null;
                    })}
                </div>

                {/* CTA */}
                <div className="mt-12 p-8 bg-slate-50 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to optimize your fleet?</h3>
                    <Link
                        href="/quote"
                        className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-[#d65a15] transition-colors"
                    >
                        Request a Quote
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {relatedPosts.map((related, i) => (
                            <Link
                                key={post.relatedSlugs[i]}
                                href={`/blog/${post.relatedSlugs[i]}`}
                                className="block p-6 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <h3 className="font-bold text-slate-900 mb-2">{related.title}</h3>
                                <p className="text-sm text-slate-500">{related.readTime}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back to Blog */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
            </div>
        </main>
    );
}
