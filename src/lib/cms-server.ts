/**
 * CMS Server Helper
 * Handles file system operations - SERVER SIDE ONLY
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// === Settings ===
const SETTINGS_FILE = path.join(CONTENT_DIR, 'settings.json');

const defaultSettings = {
    siteName: "GoGo",
    tagline: "Fuel Delivery Made Easy",
    primaryColor: "#FED75F",
    accentColor: "#ED6A21",
    contactEmail: "hello@gogo.bj",
    contactPhone: "+229 XX XX XX XX",
    defaultLanguage: "en"
};

export function getSettings() {
    if (!fs.existsSync(SETTINGS_FILE)) {
        return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
}

export function saveSettings(settings: any) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return settings;
}

// === Pages Content ===
const PAGES_FILE = path.join(CONTENT_DIR, 'pages.json');

const defaultPages = {
    home: {
        hero: {
            title: { en: "", fr: "" },
            subtitle: { en: "", fr: "" },
            image: ""
        }
    }
};

export function getPageContent(slug: string) {
    let pages = defaultPages;
    if (fs.existsSync(PAGES_FILE)) {
        const data = fs.readFileSync(PAGES_FILE, 'utf-8');
        pages = { ...defaultPages, ...JSON.parse(data) };
    }
    return pages[slug as keyof typeof pages] || {};
}

export function savePageContent(slug: string, content: any) {
    let pages = defaultPages;
    if (fs.existsSync(PAGES_FILE)) {
        pages = { ...defaultPages, ...JSON.parse(fs.readFileSync(PAGES_FILE, 'utf-8')) };
    }

    pages = {
        ...pages,
        [slug]: content
    };

    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));
    return content;
}
// === Blog Content ===
const POSTS_FILE = path.join(CONTENT_DIR, 'posts.json');

export interface BlogPost {
    slug: string;
    title: string;
    seoDescription?: string;
    publishedDate: string;
    author?: string;
    tags?: string[];
    body: string;
}

export function getBlogPosts(): BlogPost[] {
    if (fs.existsSync(POSTS_FILE)) {
        const data = fs.readFileSync(POSTS_FILE, 'utf-8');
        const posts = JSON.parse(data) as BlogPost[];
        // Sort by date desc
        return posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    }
    return [];
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
    const posts = getBlogPosts();
    return posts.find(p => p.slug === slug) || null;
}
