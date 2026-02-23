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
                    <Coins className="w-4 h-4 text-sonara-primary" />
                    <span className="text-sm font-mono font-bold text-sonara-text">
                        {balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-sonara-text-muted hidden sm:inline">SONARA</span>
                </button>
            }
            position="bottom-right"
            offset={8}
            menuClassName="w-64 p-4"
        >
            <h4 className="text-sm font-semibold text-sonara-text mb-3">Token Balance</h4>

            <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-sonara-text-muted">Available</span>
                    <span className="text-sm font-mono font-medium text-sonara-text">
                        {balance.toLocaleString()} SONARA
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-sonara-text-muted flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Staked
                    </span>
                    <span className="text-sm font-mono font-medium text-sonara-text">
                        {staked.toLocaleString()} SONARA
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-sonara-text-muted flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-sonara-success" /> Rewards
                    </span>
                    <span className="text-sm font-mono font-medium text-sonara-success">
                        +{pending.toLocaleString()} SONARA
                    </span>
                </div>
            </div>

            <div className="border-t border-sonara-border/50 mt-3 pt-3">
                <Link
                    href="/portfolio"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg btn-primary text-xs"
                >
                    <ArrowRight className="w-3.5 h-3.5" /> View Portfolio
                </Link>
            </div>
        </Dropdown>
    );
}
