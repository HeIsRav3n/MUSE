"use client";

import { TrendingUp, Users, Disc3, DollarSign } from "lucide-react";
import { platformStats } from "@/lib/liveData";
import { formatNumber } from "@/lib/web3";
import React, { memo } from "react";

const stats = [
    {
        label: "Total Value Locked",
        value: `$${formatNumber(platformStats.tvl)}`,
        change: "+12.4%",
        positive: true,
        icon: DollarSign,
        color: "text-muse-primary",
        bg: "from-muse-primary/20 to-muse-primary/5",
    },
    {
        label: "Active Wallets",
        value: formatNumber(platformStats.activeWallets),
        change: "+8.2%",
        positive: true,
        icon: Users,
        color: "text-muse-secondary",
        bg: "from-muse-secondary/20 to-muse-secondary/5",
    },
    {
        label: "Artists Launched",
        value: platformStats.artistsLaunched.toString(),
        change: "+3",
        positive: true,
        icon: Disc3,
        color: "text-muse-accent",
        bg: "from-muse-accent/20 to-muse-accent/5",
    },
    {
        label: "24h Volume",
        value: `$${formatNumber(platformStats.totalVolume)}`,
        change: "+22.1%",
        positive: true,
        icon: TrendingUp,
        color: "text-muse-success",
        bg: "from-muse-success/20 to-muse-success/5",
    },
];

export const StatsBar = memo(function StatsBar() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="stat-card group animate-slide-up"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className={`text-[10px] font-mono font-semibold ${stat.positive ? "text-muse-success" : "text-muse-danger"}`}>
                            {stat.change}
                        </span>
                    </div>
                    <p className="text-xl lg:text-2xl font-bold font-display text-muse-text">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muse-text-muted mt-1">{stat.label}</p>
                </div>
            ))}
        </div>
    );
});
