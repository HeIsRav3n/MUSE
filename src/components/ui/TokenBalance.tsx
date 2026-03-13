"use client";

import { Coins, Lock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Dropdown } from "@/components/ui/Dropdown";
import { useEconomyStore } from "@/lib/economyStore";

export function TokenBalance() {
    // Real balance from store
    const balance = useEconomyStore((state) => state.balance);
    const staked = 25000.0; // Keep mock for now
    const pending = 347.82; // Keep mock for now

    return (
        <Dropdown
            trigger={
                <button className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/5 transition-all">
                    <Coins className="w-4 h-4 text-muse-primary" />
                    <span className="text-sm font-mono font-bold text-muse-text">
                        {balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-muse-text-muted hidden sm:inline">$AUDIO</span>
                </button>
            }
            position="bottom-right"
            offset={8}
            menuClassName="w-64 p-4"
        >
            <h4 className="text-sm font-semibold text-muse-text mb-3">Token Balance</h4>

            <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muse-text-muted">Available</span>
                    <span className="text-sm font-mono font-medium text-muse-text">
                        {balance.toLocaleString()} $AUDIO
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muse-text-muted flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Staked
                    </span>
                    <span className="text-sm font-mono font-medium text-muse-text">
                        {staked.toLocaleString()} $AUDIO
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muse-text-muted flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-muse-success" /> Rewards
                    </span>
                    <span className="text-sm font-mono font-medium text-muse-success">
                        +{pending.toLocaleString()} $AUDIO
                    </span>
                </div>
            </div>

            <div className="border-t border-muse-border/50 mt-4 pt-4 flex flex-col gap-2">
                <Link
                    href="/grants"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-muse-primary to-muse-secondary text-white font-bold text-xs hover:scale-[1.02] transition-transform shadow-md"
                >
                    Stake & Fund Labels <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                    href="/podcasts"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-muse-text font-bold text-xs transition-colors"
                >
                    Tip Creators in Podcasts <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </Dropdown>
    );
}
