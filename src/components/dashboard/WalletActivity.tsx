"use client";

import { Activity, ArrowUpRight, ArrowDownRight, Coins, Award, Gift } from "lucide-react";
import { walletActivity } from "@/lib/liveData";

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    buy: { icon: ArrowUpRight, color: "text-muse-success", label: "Buy" },
    sell: { icon: ArrowDownRight, color: "text-muse-danger", label: "Sell" },
    stake: { icon: Coins, color: "text-muse-primary", label: "Stake" },
    mint: { icon: Award, color: "text-muse-accent", label: "Mint" },
    claim: { icon: Gift, color: "text-muse-secondary", label: "Claim" },
};

export function WalletActivity() {
    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-muse-warning" />
                    <h3 className="font-display font-semibold text-muse-text">Whale Activity</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muse-warning/10">
                    <div className="w-1.5 h-1.5 bg-muse-warning rounded-full animate-pulse" />
                    <span className="text-[10px] text-muse-warning font-semibold">LIVE</span>
                </div>
            </div>

            <div className="space-y-2">
                {walletActivity.map((item, idx) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muse-primary/10 transition-all cursor-pointer"
                        >
                            <div className={`w-8 h-8 rounded-lg bg-muse-primary/10 flex items-center justify-center ${config.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.color} bg-muse-primary/10 font-semibold`}>
                                        {config.label}
                                    </span>
                                    <span className="text-sm font-medium text-muse-text truncate">
                                        {item.amount.toLocaleString()} {item.token}
                                    </span>
                                </div>
                                <p className="text-xs text-muse-text-muted">
                                    {item.address} · {item.timestamp}
                                </p>
                            </div>
                            <span className="text-xs font-mono text-muse-text-dim">
                                ${item.usdValue.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
