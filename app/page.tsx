import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { SEONewsWidget } from "@/components/seo-news-widget";
import { Particles } from "@/components/particles";
import { SeoAnimatedGraphic } from "@/components/seo-animated-graphic";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col relative">
        <Particles />

        {/* Hero Section */}
        <section className="relative pt-8 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 z-10 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Limited 1-on-1 Slots Available
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Master SEO.</span>
                <br />
                Stop Guessing. Start Ranking.
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get personalized 1-on-1 coaching that turns complex algorithms into a clear roadmap for traffic and revenue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="h-14 text-base px-8 py-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-indigo-800/30 transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/book">
                  Book Your Session
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Visuals (Animated SEO Graphic) */}
          <div className="relative z-10 perspective-1000 group">
            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-200/40 via-purple-200/40 to-pink-200/40 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 blur-3xl rounded-full opacity-60 animate-pulse" />

            <SeoAnimatedGraphic />
          </div>
        </section>

        {/* Features / Social Proof */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why Learn with Me?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Tailored Strategy", desc: "No generic advice. We audit your site and build a custom growth plan." },
                { title: "100% Execution", desc: "Forget theory. We implement live fixes and verified tactics that work in 2025." },
                { title: "Proven Results", desc: "Techniques backed by data that have systematically ranked websites #1." }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily SEO Pulse Section */}
        <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Daily SEO Pulse</h2>
              <p className="text-slate-500 dark:text-slate-400">Stay Ahead of the Algorithm. Actionable insights on the latest Google updates.</p>
            </div>
            <SEONewsWidget />
          </div>
        </section>

      </main>
    </div>
  );
}
