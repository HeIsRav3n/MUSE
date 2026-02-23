"use client";

import { TrendingUp, Users, Disc3, DollarSign } from "lucide-react";
import { platformStats } from "@/lib/mockData";
import { formatNumber, formatPercent } from "@/lib/web3";

const stats = [
    {
        label: "Total Value Locked",
        value: `$${formatNumber(platformStats.tvl)}`,
        change: "+12.4%",
        positive: true,
        icon: DollarSign,
        color: "text-sonara-primary",
        bg: "from-sonara-primary/20 to-sonara-primary/5",
    },
    {
        label: "Active Wallets",
        value: formatNumber(platformStats.activeWallets),
        change: "+8.2%",
        positive: true,
        icon: Users,
        color: "text-sonara-secondary",
        bg: "from-sonara-secondary/20 to-sonara-secondary/5",
    },
    {
        label: "Artists Launched",
        value: platformStats.artistsLaunched.toString(),
        change: "+3",
        positive: true,
        icon: Disc3,
        color: "text-sonara-accent",
        bg: "from-sonara-accent/20 to-sonara-accent/5",
    },
    {
        label: "24h Volume",
        value: `$${formatNumber(platformStats.totalVolume)}`,
        change: "+22.1%",
        positive: true,
        icon: TrendingUp,
        color: "text-sonara-success",
        bg: "from-sonara-success/20 to-sonara-success/5",
    },
];

export function StatsBar() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="stat-card group"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <span className={`text-xs font-mono font-semibold ${stat.positive ? "text-sonara-success" : "text-sonara-danger"}`}>
                            {stat.change}
                        </span>
                    </div>
                    <p className="text-2xl font-bold font-display text-sonara-text">{stat.value}</p>
                    <p className="text-xs text-sonara-text-muted mt-1">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
