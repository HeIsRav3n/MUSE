"use client";

import { useState } from "react";
import { Search, Trophy, Timer, CheckCircle2, Music, ExternalLink, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { useEconomyStore } from "@/lib/economyStore";

interface Bounty {
    id: string;
    title: string;
    reward: string;
    timeLeft: string;
    participants: number;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
}

const bounties: Bounty[] = [
    {
        id: "1",
        title: "Find a Track Matching 'Cyberpunk Jazz' Vibe",
        reward: "500 $SOUND",
        timeLeft: "2h 15m",
        participants: 12,
        difficulty: "Medium",
        description: "Looking for a high-energy jazz track with synthwave elements. Must be > 120 BPM."
    },
    {
        id: "2",
        title: "Curate a 10-Track 'Deep Focus' Playlist",
        reward: "1,000 $SOUND",
        timeLeft: "12h 00m",
        participants: 45,
        difficulty: "Hard",
        description: "Create a seamless playlist for coding/studying. No vocals allowed. Ambient/Electronic focus."
    },
    {
        id: "3",
        title: "Identify this Sample",
        reward: "150 $SOUND",
        timeLeft: "45m",
        participants: 8,
        difficulty: "Easy",
        description: "What is the vocal sample used in the drop of 'Neon Nights' by SynthWave King?"
    },
    {
        id: "4",
        title: "Best Remix of 'Crypto Summer'",
        reward: "2,500 $SOUND",
        timeLeft: "3d 4h",
        participants: 21,
        difficulty: "Hard",
        description: "Submit your own remix or find a hidden gem remix of the community anthem."
    }
];

export default function BountiesPage() {
    const [filter, setFilter] = useState("all");

    return (
        <div className="p-6 pb-32 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <h1 className="text-3xl font-bold font-display text-white">Discovery Bounties</h1>
                </div>
                <p className="text-muse-text-muted">Earn $SOUND by helping the community discover new music.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muse-text-muted uppercase tracking-wider mb-1">Total Rewards Distributed</p>
                    <p className="text-2xl font-bold text-muse-success">154,200 $SOUND</p>
                </div>
                <div className="glass p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muse-text-muted uppercase tracking-wider mb-1">Active Hunters</p>
                    <p className="text-2xl font-bold text-muse-primary-light">1,204</p>
                </div>
                <div className="glass p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muse-text-muted uppercase tracking-wider mb-1">Your Earnings</p>
                    <p className="text-2xl font-bold text-white">0 $SOUND</p>
                </div>
            </div>

            {/* Bounties List */}
            <Section title="Active Bounties" icon={Search}>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {["all", "easy", "medium", "hard"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${filter === f
                                ? "bg-muse-primary text-white"
                                : "bg-white/5 text-muse-text-muted hover:text-white"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {bounties
                        .filter(b => filter === "all" || b.difficulty.toLowerCase() === filter)
                        .map((bounty) => (
                            <div key={bounty.id} className="group relative bg-muse-card/40 hover:bg-muse-card border border-white/5 hover:border-muse-primary/30 rounded-xl p-4 transition-all hover:translate-x-1 cursor-pointer">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bounty.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                                                bounty.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                                    "bg-red-500/20 text-red-400"
                                                }`}>
                                                {bounty.difficulty}
                                            </span>
                                            <span className="text-xs text-muse-text-dim flex items-center gap-1">
                                                <Timer className="w-3 h-3" /> {bounty.timeLeft} left
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-muse-primary-light transition-colors">{bounty.title}</h3>
                                        <p className="text-sm text-muse-text-muted line-clamp-2">{bounty.description}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className="text-lg font-bold text-muse-success bg-muse-success/10 px-3 py-1 rounded-lg border border-muse-success/20">
                                            {bounty.reward}
                                        </span>
                                        <span className="text-xs text-muse-text-dim">{bounty.participants} hunting</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-muse-text-muted flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Verified by Community
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Simulate claiming bounty
                                            const rewardAmount = parseInt(bounty.reward.replace(/[^0-9]/g, ''));
                                            if (confirm(`Accept and Complete Bounty: "${bounty.title}"? \n(Simulated Success: You will earn ${rewardAmount} SOUND)`)) {
                                                useEconomyStore.getState().addFunds(rewardAmount, `Bounty Reward: ${bounty.title}`);
                                                alert(`🎉 Bounty Completed! You earned ${rewardAmount} SOUND.`);
                                            }
                                        }}
                                        className="text-xs font-bold text-muse-primary flex items-center gap-1 hover:underline"
                                    >
                                        Claim / Complete <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </Section>
        </div>
    );
}
