import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// In a real app, this would fetch from DB
const MOCK_LEVEL = {
    current: 3,
    title: "SEO Strategist",
    xp: 750,
    nextLevelXp: 1000,
    nextReward: "Free 15m Audit"
};

export function RewardsCard() {
    const progress = (MOCK_LEVEL.xp / MOCK_LEVEL.nextLevelXp) * 100;

    return (
        <Card className="h-full border-amber-100 dark:border-amber-900/30 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-500">
                    <Trophy className="w-5 h-5" />
                    Your Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Level</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            Lvl {MOCK_LEVEL.current} • {MOCK_LEVEL.title}
                        </h3>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>{MOCK_LEVEL.xp} XP</span>
                        <span>{MOCK_LEVEL.nextLevelXp} XP</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-amber-500" />
                    <p className="text-xs text-center text-slate-500 mt-1">
                        Get <strong>{MOCK_LEVEL.nextLevelXp - MOCK_LEVEL.xp} XP</strong> more to unlock: <span className="text-amber-600 dark:text-amber-400 font-medium">{MOCK_LEVEL.nextReward}</span>
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">5</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Sessions</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">12h</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Learned</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
