"use client";

import { useState } from "react";
import {
    ArrowUpRight, ArrowDownRight,
    X, Rocket
} from "lucide-react";
import { mockArtistCoins } from "@/lib/mockData";
import { formatNumber, formatPercent } from "@/lib/web3";
import { useEconomyStore } from "@/lib/economyStore";

export default function CoinsPage() {
    const [showLaunchModal, setShowLaunchModal] = useState(false);
    const [sortBy, setSortBy] = useState<"marketCap" | "change" | "volume">("marketCap");

    const sorted = [...mockArtistCoins].sort((a, b) => {
        if (sortBy === "change") return b.priceChange24h - a.priceChange24h;
        if (sortBy === "volume") return b.volume24h - a.volume24h;
        return b.marketCap - a.marketCap;
    });

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">Artist Coins</h1>
                    <p className="text-sm text-sonara-text-muted mt-1">
                        Invest in artist micro-economies through tokenized bonding curves
                    </p>
                </div>
                <button onClick={() => setShowLaunchModal(true)} className="btn-primary">
                    <Rocket className="w-4 h-4" /> Launch Coin
                </button>
            </div>

            {/* Market Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Total Market Cap</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">
                        ${formatNumber(mockArtistCoins.reduce((s, c) => s + c.marketCap, 0))}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">24h Volume</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">
                        ${formatNumber(mockArtistCoins.reduce((s, c) => s + c.volume24h, 0))}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Active Coins</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">{mockArtistCoins.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Total Holders</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">
                        {formatNumber(mockArtistCoins.reduce((s, c) => s + c.holders, 0))}
                    </p>
                </div>
            </div>

            {/* Sort Tabs */}
            <div className="flex gap-2">
                {(["marketCap", "change", "volume"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === s
                            ? "bg-sonara-primary text-white"
                            : "bg-white/5 text-sonara-text-dim hover:bg-white/10 border border-sonara-border/50"
                            }`}
                    >
                        {s === "marketCap" ? "Market Cap" : s === "change" ? "24h Change" : "Volume"}
                    </button>
                ))}
            </div>

            {/* Coins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map((coin) => {
                    const isPositive = coin.priceChange24h >= 0;
                    return (
                        <div key={coin.id} className="glass rounded-2xl p-5 glass-hover cursor-pointer group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sonara-primary/30 to-sonara-accent/20 flex items-center justify-center">
                                        <span className="text-lg font-bold gradient-text">{coin.symbol[1]}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-sonara-text">{coin.name}</p>
                                        <p className="text-xs text-sonara-text-muted">{coin.symbol}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${isPositive ? "text-sonara-success" : "text-sonara-danger"
                                    }`}>
                                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {formatPercent(coin.priceChange24h)}
                                </span>
                            </div>

                            {/* Mini sparkline */}
                            <div className="h-12 mb-4 flex items-end gap-[2px]">
                                {coin.sparkline.map((v, i) => {
                                    const max = Math.max(...coin.sparkline);
                                    const min = Math.min(...coin.sparkline);
                                    const h = ((v - min) / (max - min)) * 100;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t ${isPositive ? "bg-sonara-success/40" : "bg-sonara-danger/40"}`}
                                            style={{ height: `${Math.max(h, 5)}%` }}
                                        />
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <p className="text-2xl font-bold font-mono text-sonara-text">${coin.price.toFixed(2)}</p>
                                <p className="text-xs text-sonara-text-muted">by {coin.artistName}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                <div className="glass rounded-lg py-2">
                                    <p className="text-[10px] text-sonara-text-muted">Mkt Cap</p>
                                    <p className="text-xs font-mono font-semibold text-sonara-text">${formatNumber(coin.marketCap)}</p>
                                </div>
                                <div className="glass rounded-lg py-2">
                                    <p className="text-[10px] text-sonara-text-muted">Holders</p>
                                    <p className="text-xs font-mono font-semibold text-sonara-text">{formatNumber(coin.holders)}</p>
                                </div>
                                <div className="glass rounded-lg py-2">
                                    <p className="text-[10px] text-sonara-text-muted">Volume</p>
                                    <p className="text-xs font-mono font-semibold text-sonara-text">${formatNumber(coin.volume24h)}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const cost = coin.price * 10; // Buy 10 for simplicity
                                        if (confirm(`Buy 10 $${coin.symbol} for $${cost.toFixed(2)}?`)) {
                                            const success = useEconomyStore.getState().buyCoin(coin.id, coin.symbol, 10, cost);
                                            if (success) alert(`Bought 10 ${coin.symbol}!`);
                                            else alert("Insufficient funds!");
                                        }
                                    }}
                                    className="flex-1 btn-primary text-xs py-2 justify-center hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const val = coin.price * 10; // Sell 10 for simplicity
                                        if (confirm(`Sell 10 $${coin.symbol} for $${val.toFixed(2)}?`)) {
                                            const success = useEconomyStore.getState().sellCoin(coin.id, coin.symbol, 10, val);
                                            if (success) alert(`Sold 10 ${coin.symbol}!`);
                                            else alert("You don't have enough coins to sell!");
                                        }
                                    }}
                                    className="flex-1 btn-secondary text-xs py-2 justify-center hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Sell
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Launch Coin Modal */}
            {showLaunchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-display font-bold gradient-text">Launch Artist Coin</h3>
                            <button onClick={() => setShowLaunchModal(false)} className="p-1 rounded-lg hover:bg-white/5">
                                <X className="w-5 h-5 text-sonara-text-muted" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1 block">Coin Name</label>
                                <input className="w-full px-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sonara-text focus:outline-none focus:border-sonara-primary/50" placeholder="e.g. Vex Coin" />
                            </div>
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1 block">Symbol</label>
                                <input className="w-full px-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sonara-text focus:outline-none focus:border-sonara-primary/50" placeholder="e.g. $VEX" />
                            </div>
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1 block">Initial Supply</label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sonara-text focus:outline-none focus:border-sonara-primary/50" placeholder="1,000,000" />
                            </div>
                            <div className="glass rounded-xl p-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Bonding Curve</span>
                                    <span className="text-sonara-primary-light">Linear</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Platform Fee</span>
                                    <span className="text-sonara-text">2%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Creator Share</span>
                                    <span className="text-sonara-success">5% of all trades</span>
                                </div>
                            </div>
                            <button className="w-full btn-primary py-3 justify-center text-base">
                                <Rocket className="w-5 h-5" /> Launch Coin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
