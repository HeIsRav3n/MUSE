"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Zap,
    Activity,
    Flame,
    Play,
    BarChart3,
    ChevronRight,
} from "lucide-react";
import { sdkGetTrendingTracks, sdkStreamUrl, formatCount, type SdkTrack } from "@/lib/audiusSdk";
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";

// Mock scanner scores
function breakoutScore() { return Math.floor(Math.random() * 40) + 60; }
function growthPct() { return Math.floor(Math.random() * 180) + 20; }

export default function ScannerPage() {
    // Force rebuild
    const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
    const [artists, setArtists] = useState<SdkTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { play } = useAudioData();

    useEffect(() => {
        setLoading(true);
        sdkGetTrendingTracks(20).then((t) => {
            setArtists(t);
            setLoading(false);
        });
    }, [timeframe]);

    const playTrack = (t: SdkTrack) => {
        const qt: QueueTrack = {
            id: t.id,
            title: t.title,
            artist: t.user.name,
            artwork: t.artwork?.["480x480"],
            audioUrl: sdkStreamUrl(t.id),
            duration: t.duration,
        };
        play(qt);
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                        MUSE Trend Scanner
                    </h1>
                    <p className="text-sm text-muse-text-muted mt-1">
                        AI-powered market intelligence & audio alpha discovery
                    </p>
                </div>
                <div className="flex gap-1 glass rounded-xl p-1">
                    {(["24h", "7d", "30d"] as const).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${timeframe === tf
                                ? "bg-muse-primary text-white shadow-glow"
                                : "text-muse-text-muted hover:text-muse-text"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Emerging Artists", value: artists.length, change: "+15%", icon: TrendingUp, color: "text-muse-primary" },
                    { label: "Avg Breakout Prob", value: "78%", change: "+8%", icon: Zap, color: "text-yellow-400" },
                    { label: "Token Volume", value: "$4.2M", change: "+23%", icon: Activity, color: "text-muse-secondary" },
                    { label: "Hot Streak", value: "12", change: "+42%", icon: Flame, color: "text-orange-400" },
                ].map((m) => (
                    <div key={m.label} className="stat-card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muse-text-muted">{m.label}</span>
                            <m.icon className={`w-4 h-4 ${m.color}`} />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-xl font-bold text-muse-text">{m.value}</span>
                            <span className="text-xs font-semibold text-muse-success">{m.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Breakout Heatmap */}
                <div className="lg:col-span-2 glass rounded-2xl p-5">
                    <h2 className="text-lg font-semibold text-muse-text mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-muse-primary" /> Breakout Heatmap
                    </h2>
                    <div className="grid grid-cols-5 gap-2">
                        {artists.slice(0, 15).map((a) => {
                            const score = breakoutScore();
                            const pct = score / 100;
                            return (
                                <button
                                    key={a.id}
                                    onClick={() => playTrack(a)}
                                    className="relative aspect-square rounded-xl overflow-hidden group transition-transform hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(139,92,246,${pct * 0.8}), rgba(244,114,182,${pct * 0.5}))`,
                                    }}
                                >
                                    {a.artwork?.["150x150"] && (
                                        <img src={a.artwork["150x150"]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition" />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
                                        <span className="text-[10px] font-bold text-white truncate w-full text-center">{a.user.name}</span>
                                        <span className="text-lg font-black text-white">{score}%</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Trending Artists */}
                <div className="glass rounded-2xl p-5">
                    <h2 className="text-lg font-semibold text-muse-text mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-muse-success" /> Trending Artists
                    </h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-xl shimmer" />
                            ))
                            : artists.slice(0, 12).map((a, i) => (
                                <button
                                    key={a.id}
                                    onClick={() => playTrack(a)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group"
                                >
                                    <span className="text-xs font-mono text-muse-text-muted w-5">{i + 1}</span>
                                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                        {a.artwork?.["150x150"] ? (
                                            <img src={a.artwork["150x150"]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-muse-primary/40 to-muse-secondary/40" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium text-muse-text truncate">{a.user.name}</p>
                                        <p className="text-[10px] text-muse-text-muted">{formatCount(a.playCount)} plays</p>
                                    </div>
                                    <span className="text-xs font-semibold text-muse-success">+{growthPct()}%</span>
                                    <Play className="w-3.5 h-3.5 text-muse-text-muted opacity-0 group-hover:opacity-100 transition" />
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            {/* Undervalued Radar */}
            <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-muse-text flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Undervalued Radar
                    </h2>
                    <button className="text-xs text-muse-primary hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {artists.slice(10, 18).map((a) => (
                        <button
                            key={a.id}
                            onClick={() => playTrack(a)}
                            className="flex items-center gap-3 p-3 rounded-xl glass-hover group"
                        >
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                {a.artwork?.["150x150"] ? (
                                    <img src={a.artwork["150x150"]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-muse-primary/30 to-muse-accent/30" />
                                )}
                            </div>
                            <div className="min-w-0 text-left">
                                <p className="text-sm font-medium text-muse-text truncate">{a.title}</p>
                                <p className="text-[10px] text-muse-text-muted truncate">{a.user.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
