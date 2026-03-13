"use client";

import { motion } from "framer-motion";

interface PlaylistStatsProps {
    totalTracks: number;
    uniqueArtists: number;
    totalPlays: number;
    totalDurationSeconds: number;
}

export default function PlaylistStats({ totalTracks, uniqueArtists, totalPlays, totalDurationSeconds }: PlaylistStatsProps) {
    const minutes = Math.floor(totalDurationSeconds / 60);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const stats = [
        { label: "TRACKS", value: totalTracks },
        { label: "ARTISTS", value: uniqueArtists },
        { label: "TOTAL PLAYS", value: formatNumber(totalPlays) },
        { label: "MINUTES", value: minutes },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto my-12 md:my-20 relative z-10">
            <div className="glass-strong rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
                {/* Decorative glowing lines */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-muse-primary via-muse-secondary to-muse-accent" />
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-2 md:px-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                            className="flex flex-col items-center justify-center text-center space-y-3"
                        >
                            <span className="text-[10px] md:text-sm font-mono font-bold text-muse-text-muted tracking-[0.25em] uppercase">
                                {stat.label}
                            </span>
                            <span className="text-3xl md:text-4xl font-display font-extrabold gradient-text drop-shadow-lg">
                                {stat.value}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
