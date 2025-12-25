"use server";

import Parser from "rss-parser";
import { unstable_cache } from "next/cache";

const parser = new Parser();

// Default sources
const RSS_FEEDS = [
    "https://feeds.feedburner.com/SearchEngineLand",
    "https://developers.google.com/search/blog/rss.xml",
    "https://searchengineland.com/feed"
];

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet?: string;
}

async function fetchNews() {
    console.log("Fetching RSS feeds...");
    let allNews: NewsItem[] = [];

    for (const url of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(url);
            const items = feed.items.slice(0, 3).map(item => ({
                title: item.title || "Untitled",
                link: item.link || "#",
                pubDate: item.pubDate || new Date().toISOString(),
                source: feed.title || "SEO News",
                snippet: item.contentSnippet?.substring(0, 100) + "..."
            }));
            allNews = [...allNews, ...items];
        } catch (e) {
            console.error(`Failed to fetch RSS from ${url}`, e);
        }
    }

    // Sort by date descending
    return allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 5);
}

// Cache for 12 hours (43200 seconds) to avoid spamming external servers
export const getCachedNews = unstable_cache(
    async () => fetchNews(),
    ["seo-news-feed"],
    { revalidate: 43200 }
);
