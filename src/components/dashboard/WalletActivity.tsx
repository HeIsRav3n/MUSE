"use client";

import { Activity, ArrowUpRight, ArrowDownRight, Coins, Award, Gift } from "lucide-react";
import { mockWalletActivity } from "@/lib/mockData";

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    buy: { icon: ArrowUpRight, color: "text-sonara-success", label: "Buy" },
    sell: { icon: ArrowDownRight, color: "text-sonara-danger", label: "Sell" },
    stake: { icon: Coins, color: "text-sonara-primary", label: "Stake" },
    mint: { icon: Award, color: "text-sonara-accent", label: "Mint" },
    claim: { icon: Gift, color: "text-sonara-secondary", label: "Claim" },
};

export function WalletActivity() {
    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sonara-warning" />
                    <h3 className="font-display font-semibold text-sonara-text">Whale Activity</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sonara-warning/10">
                    <div className="w-1.5 h-1.5 bg-sonara-warning rounded-full animate-pulse" />
                    <span className="text-[10px] text-sonara-warning font-semibold">LIVE</span>
                </div>
            </div>

            <div className="space-y-2">
                {mockWalletActivity.map((item) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${config.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.color} bg-white/5 font-semibold`}>
                                        {config.label}
                                    </span>
                                    <span className="text-sm font-medium text-sonara-text truncate">
                                        {item.amount.toLocaleString()} {item.token}
                                    </span>
                                </div>
                                <p className="text-xs text-sonara-text-muted">
                                    {item.address} · {item.timestamp}
                                </p>
                            </div>
                            <span className="text-xs font-mono text-sonara-text-dim">
                                ${item.usdValue.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
