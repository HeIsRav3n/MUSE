"use client";

import { Brain, Zap, ArrowUpRight } from "lucide-react";
import { mockBreakoutPredictions } from "@/lib/mockData";

const probabilityColor = (p: number) => {
    if (p >= 85) return { text: "text-sonara-success", bg: "bg-sonara-success", glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]" };
    if (p >= 70) return { text: "text-sonara-primary", bg: "bg-sonara-primary", glow: "shadow-[0_0_10px_rgba(139,92,246,0.3)]" };
    return { text: "text-sonara-warning", bg: "bg-sonara-warning", glow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]" };
};

export function BreakoutPredictions() {
    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-sonara-primary" />
                    <h3 className="font-display font-semibold text-sonara-text">AI Breakout Predictions</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sonara-primary/10">
                    <Zap className="w-3 h-3 text-sonara-primary" />
                    <span className="text-[10px] text-sonara-primary font-semibold">LIVE</span>
                </div>
            </div>

            <div className="space-y-3">
                {mockBreakoutPredictions.map((prediction) => {
                    const colors = probabilityColor(prediction.probability);
                    return (
                        <div
                            key={prediction.id}
                            className="p-3.5 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-sonara-border/50 hover:border-sonara-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sonara-primary/20 to-sonara-secondary/10 flex items-center justify-center text-sm font-bold gradient-text">
                                        {prediction.artistName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-sonara-text">{prediction.artistName}</p>
                                        <p className="text-xs text-sonara-text-muted">{prediction.genre}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${colors.bg}/10 ${colors.glow}`}>
                                    <span className={`text-lg font-bold font-mono ${colors.text}`}>{prediction.probability}%</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-sonara-text-muted">
                                    {(prediction.monthlyListeners / 1000).toFixed(0)}K listeners
                                </span>
                                <span className="text-xs text-sonara-success flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {prediction.growthRate}% growth
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {prediction.signals.map((signal) => (
                                    <span
                                        key={signal}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-sonara-primary/10 text-sonara-primary-light border border-sonara-primary/20"
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
