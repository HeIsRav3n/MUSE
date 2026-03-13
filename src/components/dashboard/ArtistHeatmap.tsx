"use client";

import { Flame, ArrowUpRight } from "lucide-react";

const heatmapArtists = [
    { name: "Prism", genre: "Electronic", heat: 95, change: "+340%", listeners: "45K", color: "#8b5cf6" },
    { name: "NexGen", genre: "Hip Hop", heat: 88, change: "+156%", listeners: "128K", color: "#06b6d4" },
    { name: "Drift", genre: "Lo-Fi", heat: 82, change: "+210%", listeners: "32K", color: "#f472b6" },
    { name: "Vex", genre: "Pop", heat: 76, change: "+120%", listeners: "67K", color: "#10b981" },
    { name: "Echo Chamber", genre: "Alt Rock", heat: 71, change: "+95%", listeners: "21K", color: "#f59e0b" },
    { name: "Luna Wave", genre: "R&B", heat: 65, change: "+78%", listeners: "54K", color: "#ef4444" },
    { name: "Synth Lord", genre: "Synthwave", heat: 58, change: "+62%", listeners: "18K", color: "#8b5cf6" },
    { name: "Bass Theory", genre: "DnB", heat: 52, change: "+45%", listeners: "29K", color: "#06b6d4" },
];

export function ArtistHeatmap() {
    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-muse-accent" />
                    <h3 className="font-display font-semibold text-muse-text">Emerging Artists Index</h3>
                </div>
                <button className="text-xs text-muse-primary hover:text-muse-primary-light transition-colors">View All</button>
            </div>

            <div className="space-y-2.5">
                {heatmapArtists.map((artist, i) => (
                    <div
                        key={artist.name}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer"
                    >
                        <span className="text-xs font-mono text-muse-text-muted w-5">{i + 1}</span>
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: `${artist.color}30`, color: artist.color }}
                        >
                            {artist.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muse-text truncate">{artist.name}</p>
                            <p className="text-xs text-muse-text-muted">{artist.genre} · {artist.listeners}</p>
                        </div>
                        {/* Heat bar */}
                        <div className="hidden sm:flex items-center gap-2 w-24">
                            <div className="flex-1 h-1.5 bg-muse-border rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${artist.heat}%`,
                                        background: `linear-gradient(90deg, ${artist.color}80, ${artist.color})`,
                                    }}
                                />
                            </div>
                            <span className="text-xs font-mono" style={{ color: artist.color }}>{artist.heat}</span>
                        </div>
                        <span className="text-xs font-mono text-muse-success flex items-center gap-0.5">
                            {artist.change}
                            <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
