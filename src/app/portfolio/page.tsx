"use client";

import { useState } from "react";
import {
    ArrowUpRight, ArrowDownRight,
    Wallet, BarChart3, TrendingUp
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/web3";
import { useEconomyStore } from "@/lib/economyStore";

const typeColors: Record<string, string> = {
    Coin: "text-muse-primary bg-muse-primary/10",
    Bond: "text-muse-secondary bg-muse-secondary/10",
    Stem: "text-muse-accent bg-muse-accent/10",
    NFT: "text-muse-warning bg-muse-warning/10",
};

export default function PortfolioPage() {
    const [timeRange, setTimeRange] = useState("30D");

    // Get real state
    const { balance, portfolio } = useEconomyStore();

    // Transform State into "Holdings" format for the table
    // 1. Coins
    const coinHoldings = Object.entries(portfolio.coins).map(([id, amount]) => ({
        id: `coin-${id}`,
        name: `$${id.toUpperCase()}`, // Using ID as symbol/name for now
        type: "Coin",
        amount,
        value: amount * 10, // Mock price $10 per coin for calculation
        costBasis: amount * 8, // Mock cost
        change24h: 2.5
    }));

    // 2. Bonds
    const bondHoldings = portfolio.bonds.map((b, i) => ({
        id: `bond-${i}`,
        name: `${b.albumTitle} Bond`,
        type: "Bond",
        amount: 1,
        value: b.amount,
        costBasis: b.amount,
        change24h: 0
    }));

    // 3. NFTs
    const nftHoldings = portfolio.nfts.map((n, i) => ({
        id: `nft-${i}`,
        name: `${n} License`,
        type: "NFT",
        amount: 1,
        value: 500, // Mock value
        costBasis: 450,
        change24h: 12.0
    }));

    // Combine
    const allHoldings = [...coinHoldings, ...bondHoldings, ...nftHoldings];

    // Calculate Totals
    const holdingsValue = allHoldings.reduce((s, h) => s + h.value, 0);
    const totalValue = holdingsValue + balance; // Total Net Worth including liquid cash

    const totalCost = allHoldings.reduce((s, h) => s + h.costBasis, 0); // Only for investments
    const investmentPnL = holdingsValue - totalCost;
    const investmentPnLPct = totalCost > 0 ? (investmentPnL / totalCost) * 100 : 0;

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">Portfolio</h1>
                <p className="text-sm text-muse-text-muted mt-1">Track your music investments and returns</p>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Net Worth</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">${formatNumber(totalValue)}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Liquid Cash</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">${formatNumber(balance)}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Investment P&L</p>
                    <p className={`text-xl font-bold font-display mt-1 ${investmentPnL >= 0 ? "text-muse-success" : "text-muse-danger"}`}>
                        {investmentPnL >= 0 ? "+" : ""}${formatNumber(Math.abs(investmentPnL))}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">ROI</p>
                    <p className={`text-xl font-bold font-display mt-1 ${investmentPnLPct >= 0 ? "text-muse-success" : "text-muse-danger"}`}>
                        {formatPercent(investmentPnLPct)}
                    </p>
                </div>
            </div>

            {/* Chart - Placeholder for now, visualizing mock history + current value */}
            <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-muse-text flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-muse-primary" /> Portfolio Value
                    </h3>
                </div>
                <div className="h-48 flex items-center justify-center text-muse-text-muted bg-white/5 rounded-xl border border-white/5 border-dashed">
                    <div className="text-center">
                        <TrendingUp className="w-8 h-8 opacity-50 mx-auto mb-2" />
                        <p className="text-sm">Chart will populate as data accumulates</p>
                    </div>
                </div>
            </div>

            {/* Holdings Table */}
            <div className="glass rounded-2xl p-5">
                <h3 className="font-display font-semibold text-muse-text mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-muse-secondary" /> Holdings
                </h3>
                {allHoldings.length === 0 ? (
                    <div className="py-12 text-center text-muse-text-muted">
                        <p>No investments yet.</p>
                        <p className="text-xs mt-1">Visit the <a href="/coins" className="text-muse-primary hover:underline">Market</a> to start trading.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-muse-border/50">
                                    <th className="text-left py-3 text-xs text-muse-text-muted font-medium">Asset</th>
                                    <th className="text-right py-3 text-xs text-muse-text-muted font-medium">Amount</th>
                                    <th className="text-right py-3 text-xs text-muse-text-muted font-medium">Value</th>
                                    <th className="text-right py-3 text-xs text-muse-text-muted font-medium">Cost</th>
                                    <th className="text-right py-3 text-xs text-muse-text-muted font-medium">P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allHoldings.map((h) => {
                                    const pnl = h.value - h.costBasis;
                                    const pnlPct = h.costBasis > 0 ? (pnl / h.costBasis) * 100 : 0;
                                    return (
                                        <tr key={h.id} className="border-b border-muse-border/30 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muse-primary/20 to-muse-secondary/10 flex items-center justify-center text-xs font-bold gradient-text">
                                                        {h.type === 'Bond' ? 'B' : h.name[1]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-muse-text">{h.name}</p>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeColors[h.type]}`}>{h.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right font-mono text-muse-text">{h.amount.toLocaleString()}</td>
                                            <td className="text-right font-mono text-muse-text">${formatNumber(h.value)}</td>
                                            <td className="text-right font-mono text-muse-text-dim">${formatNumber(h.costBasis)}</td>
                                            <td className={`text-right font-mono ${pnl >= 0 ? "text-muse-success" : "text-muse-danger"}`}>
                                                {pnl >= 0 ? "+" : ""}${formatNumber(Math.abs(pnl))}
                                                <span className="text-[10px] ml-1">({formatPercent(pnlPct)})</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
