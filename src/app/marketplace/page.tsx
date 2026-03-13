"use client";

import { useState } from "react";
import {
    Play, ShoppingCart,
    X, Check
} from "lucide-react";
import { stemListings } from "@/lib/liveData";
import { useEconomyStore } from "@/lib/economyStore";

const stemTypeColors: Record<string, string> = {
    Vocals: "text-muse-accent bg-muse-accent/10 border-muse-accent/20",
    Drums: "text-muse-warning bg-muse-warning/10 border-muse-warning/20",
    Bass: "text-muse-success bg-muse-success/10 border-muse-success/20",
    Melody: "text-muse-primary bg-muse-primary/10 border-muse-primary/20",
    "Full Mix": "text-muse-secondary bg-muse-secondary/10 border-muse-secondary/20",
};

const licenseIcons: Record<string, string> = {
    "Non-Exclusive": "🔓",
    Exclusive: "🔒",
    Commercial: "💼",
};

export default function MarketplacePage() {
    const [selectedType, setSelectedType] = useState("All");
    const [showPurchaseModal, setShowPurchaseModal] = useState<string | null>(null);

    const types = ["All", "Vocals", "Drums", "Bass", "Melody", "Full Mix"];
    const filtered = selectedType === "All"
        ? stemListings
        : stemListings.filter((s) => s.stemType === selectedType);

    const selectedStem = stemListings.find((s) => s.id === showPurchaseModal);

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                    Remix Marketplace
                </h1>
                <p className="text-sm text-muse-text-muted mt-1">
                    License stems, trade remix rights, and earn royalties from derivative works
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Listed Stems</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">{stemListings.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Total Purchases</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">
                        {stemListings.reduce((s, l) => s + l.purchases, 0)}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Avg. Royalty</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">
                        {(stemListings.reduce((s, l) => s + l.royaltyBPS, 0) / stemListings.length / 100).toFixed(1)}%
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-muse-text-muted">Price Range</p>
                    <p className="text-xl font-bold font-display text-muse-text mt-1">
                        {Math.min(...stemListings.map((l) => l.price))} - {Math.max(...stemListings.map((l) => l.price))} ETH
                    </p>
                </div>
            </div>

            {/* Type filter */}
            <div className="flex gap-2 flex-wrap">
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type
                            ? "bg-muse-primary text-white"
                            : "bg-white/5 text-muse-text-dim hover:bg-white/10 border border-muse-border/50"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Stems grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((stem) => (
                    <div key={stem.id} className="glass rounded-2xl overflow-hidden glass-hover group cursor-pointer">
                        {/* Cover art */}
                        <div className="h-40 bg-gradient-to-br from-muse-primary/20 via-muse-secondary/10 to-muse-accent/15 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-all">
                                    <Play className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                            <div className="absolute top-3 left-3">
                                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${stemTypeColors[stem.stemType]}`}>
                                    {stem.stemType}
                                </span>
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className="text-xs px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white/80">
                                    {licenseIcons[stem.licenseType]} {stem.licenseType}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="text-sm font-semibold text-muse-text mb-1 truncate">{stem.title}</h4>
                            <p className="text-xs text-muse-text-muted mb-3">by {stem.artistName}</p>

                            <div className="flex items-center gap-3 mb-3 text-xs text-muse-text-muted">
                                <span>{stem.bpm} BPM</span>
                                <span>Key: {stem.key}</span>
                                <span>{stem.genre}</span>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-lg font-bold font-mono text-muse-text">{stem.price} ETH</p>
                                    <p className="text-[10px] text-muse-text-muted">{stem.royaltyBPS / 100}% royalties</p>
                                </div>
                                <p className="text-xs text-muse-text-muted">{stem.purchases} purchased</p>
                            </div>

                            <button
                                onClick={() => setShowPurchaseModal(stem.id)}
                                className="w-full btn-primary text-xs py-2.5 justify-center"
                            >
                                <ShoppingCart className="w-4 h-4" /> Purchase License
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && selectedStem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-display font-bold gradient-text">Purchase License</h3>
                            <button onClick={() => setShowPurchaseModal(null)} className="p-1 rounded-lg hover:bg-white/5">
                                <X className="w-5 h-5 text-muse-text-muted" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="glass rounded-xl p-4">
                                <p className="text-sm font-semibold text-muse-text">{selectedStem.title}</p>
                                <p className="text-xs text-muse-text-muted">by {selectedStem.artistName}</p>
                            </div>
                            <div className="glass rounded-xl p-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muse-text-muted">License Type</span>
                                    <span className="text-muse-text">{selectedStem.licenseType}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muse-text-muted">Price</span>
                                    <span className="text-muse-text font-mono">{selectedStem.price} ETH</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muse-text-muted">Ongoing Royalty</span>
                                    <span className="text-muse-primary-light">{selectedStem.royaltyBPS / 100}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muse-text-muted">Platform Fee</span>
                                    <span className="text-muse-text">2.5%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muse-text-dim">
                                    <Check className="w-3.5 h-3.5 text-muse-success" /> Rights transferred as ERC-721 NFT
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muse-text-dim">
                                    <Check className="w-3.5 h-3.5 text-muse-success" /> Automatic royalty distribution on-chain
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muse-text-dim">
                                    <Check className="w-3.5 h-3.5 text-muse-success" /> Resellable on secondary market
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const success = useEconomyStore.getState().buyNFT(selectedStem.id, selectedStem.title, selectedStem.price * 3000); // 1 ETH = 3000 SOUND (mock)
                                    if (success) {
                                        alert(`Successfully purchased license for ${selectedStem.title}!`);
                                        setShowPurchaseModal(null);
                                    } else {
                                        alert("Insufficient funds or already owned!");
                                    }
                                }}
                                className="w-full btn-primary py-3 justify-center text-base hover:scale-105 active:scale-95 transition-transform"
                            >
                                <ShoppingCart className="w-5 h-5" /> Confirm Purchase — {selectedStem.price} ETH
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
