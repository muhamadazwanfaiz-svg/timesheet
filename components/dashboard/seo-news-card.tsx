import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedNews } from "@/app/actions/news";
import { ExternalLink, Rss } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export async function SeoNewsCard() {
    const news = await getCachedNews();

    return (
        <Card className="h-full border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                    <Rss className="w-5 h-5 text-indigo-500" />
                    Latest SEO Pulse
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {news.map((item, i) => (
                        <Link
                            key={i}
                            href={item.link}
                            target="_blank"
                            className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                        >
                            <h4 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug mb-1.5">
                                {item.title}
                            </h4>
                            <div className="flex items-center text-xs text-slate-500">
                                <span className="font-semibold text-slate-600 dark:text-slate-400 mr-2">{item.source}</span>
                                <span>• {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })}</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))}
                    {news.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            <p>No news available right now.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
