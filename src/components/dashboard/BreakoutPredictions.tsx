"use client";

import { Brain, Zap, ArrowUpRight } from "lucide-react";
import { breakoutPredictions } from '@/lib/liveData';

const probabilityColor = (p: number) => {
    if (p >= 85) return { text: "text-muse-success", bg: "bg-muse-success", glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]" };
    if (p >= 70) return { text: "text-muse-primary", bg: "bg-muse-primary", glow: "shadow-[0_0_10px_rgba(139,92,246,0.3)]" };
    return { text: "text-muse-warning", bg: "bg-muse-warning", glow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]" };
};

export function BreakoutPredictions() {
    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-muse-primary" />
                    <h3 className="font-display font-semibold text-muse-text">AI Breakout Predictions</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muse-primary/10">
                    <Zap className="w-3 h-3 text-muse-primary" />
                    <span className="text-[10px] text-muse-primary font-semibold">LIVE</span>
                </div>
            </div>

            <div className="space-y-3">
                {breakoutPredictions.map((prediction) => {
                    const colors = probabilityColor(prediction.probability);
                    return (
                        <div
                            key={prediction.id}
                            className="p-3.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-muse-border/50 hover:border-muse-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muse-primary/20 to-muse-secondary/10 flex items-center justify-center text-sm font-bold gradient-text">
                                        {prediction.artistName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muse-text">{prediction.artistName}</p>
                                        <p className="text-xs text-muse-text-muted">{prediction.genre}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${colors.bg}/10 ${colors.glow}`}>
                                    <span className={`text-lg font-bold font-mono ${colors.text}`}>{prediction.probability}%</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-muse-text-muted">
                                    {(prediction.monthlyListeners / 1000).toFixed(0)}K listeners
                                </span>
                                <span className="text-xs text-muse-success flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {prediction.growthRate}% growth
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {prediction.signals.map((signal) => (
                                    <span
                                        key={signal}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-muse-primary/10 text-muse-primary-light border border-muse-primary/20"
                                    >
                                        {signal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
