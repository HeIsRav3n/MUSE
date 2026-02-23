"use client";

import { useState } from "react";
import {
    Landmark, Shield, X,
    CheckCircle, DollarSign
} from "lucide-react";
import { mockAlbumBonds } from "@/lib/mockData";
import { formatNumber } from "@/lib/web3";
import { useEconomyStore } from "@/lib/economyStore";

const riskColors: Record<string, { text: string; bg: string }> = {
    Low: { text: "text-sonara-success", bg: "bg-sonara-success/10" },
    Medium: { text: "text-sonara-warning", bg: "bg-sonara-warning/10" },
    High: { text: "text-sonara-danger", bg: "bg-sonara-danger/10" },
};

const statusColors: Record<string, string> = {
    Active: "text-sonara-primary bg-sonara-primary/10",
    Funded: "text-sonara-success bg-sonara-success/10",
    Matured: "text-sonara-secondary bg-sonara-secondary/10",
};

export default function BondsPage() {
    const [showModal, setShowModal] = useState<string | null>(null);
    const [investAmt, setInvestAmt] = useState("1000");
    const selected = mockAlbumBonds.find((b) => b.id === showModal);

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">Album Bonds</h1>
                <p className="text-sm text-sonara-text-muted mt-1">Fund albums, earn streaming revenue share</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Total Raised</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">${formatNumber(mockAlbumBonds.reduce((s, b) => s + b.raisedAmount, 0))}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Active Bonds</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">{mockAlbumBonds.filter((b) => b.status === "Active").length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Avg. APY</p>
                    <p className="text-xl font-bold font-display text-sonara-success mt-1">{(mockAlbumBonds.reduce((s, b) => s + b.apy, 0) / mockAlbumBonds.length).toFixed(1)}%</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-sonara-text-muted">Investors</p>
                    <p className="text-xl font-bold font-display text-sonara-text mt-1">{formatNumber(mockAlbumBonds.reduce((s, b) => s + b.investors, 0))}</p>
                </div>
            </div>

            <div className="space-y-4">
                {mockAlbumBonds.map((bond) => {
                    const pct = (bond.raisedAmount / bond.targetAmount) * 100;
                    const risk = riskColors[bond.riskScore];
                    const days = Math.max(0, Math.ceil((new Date(bond.maturityDate).getTime() - Date.now()) / 86400000));
                    return (
                        <div key={bond.id} className="glass rounded-2xl p-5 glass-hover">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sonara-primary/30 to-sonara-accent/20 flex items-center justify-center flex-shrink-0">
                                        <Landmark className="w-7 h-7 text-sonara-primary-light" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-sonara-text">{bond.albumTitle}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[bond.status]}`}>{bond.status}</span>
                                        </div>
                                        <p className="text-sm text-sonara-text-muted">{bond.artistName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="text-center"><p className="text-xs text-sonara-text-muted">APY</p><p className="text-lg font-bold font-mono text-sonara-success">{bond.apy}%</p></div>
                                    <div className="text-center"><p className="text-xs text-sonara-text-muted">Rev Share</p><p className="text-lg font-bold font-mono text-sonara-primary-light">{bond.streamingRevenueShare}%</p></div>
                                    <div className="text-center"><p className="text-xs text-sonara-text-muted">Risk</p><p className={`text-sm font-semibold flex items-center gap-1 mt-0.5 ${risk.text}`}><Shield className="w-4 h-4" />{bond.riskScore}</p></div>
                                    <div className="text-center"><p className="text-xs text-sonara-text-muted">Time</p><p className="text-sm font-mono text-sonara-text">{days}d</p></div>
                                </div>
                                <button onClick={() => setShowModal(bond.id)} disabled={bond.status === "Funded"} className={`lg:w-36 py-2.5 text-xs justify-center ${bond.status === "Funded" ? "btn-secondary opacity-60" : "btn-primary"}`}>
                                    {bond.status === "Funded" ? <><CheckCircle className="w-4 h-4" /> Funded</> : <><DollarSign className="w-4 h-4" /> Invest</>}
                                </button>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-sonara-text-muted"><span className="text-sonara-text font-mono font-semibold">${formatNumber(bond.raisedAmount)}</span> raised</span>
                                    <span className="text-sonara-text-muted">of ${formatNumber(bond.targetAmount)}</span>
                                </div>
                                <div className="w-full h-2 bg-sonara-border rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-sonara-primary to-sonara-secondary" style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && selected && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-display font-bold gradient-text">Invest in Bond</h3>
                            <button onClick={() => setShowModal(null)} className="p-1 rounded-lg hover:bg-white/5"><X className="w-5 h-5 text-sonara-text-muted" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="glass rounded-xl p-4">
                                <p className="text-sm font-semibold text-sonara-text">{selected.albumTitle}</p>
                                <p className="text-xs text-sonara-text-muted">by {selected.artistName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1 block">Amount (USDC)</label>
                                <input type="number" value={investAmt} onChange={(e) => setInvestAmt(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sonara-text focus:outline-none focus:border-sonara-primary/50" />
                            </div>
                            <div className="glass rounded-xl p-3 space-y-2">
                                <div className="flex justify-between text-xs"><span className="text-sonara-text-muted">APY</span><span className="text-sonara-success font-mono">{selected.apy}%</span></div>
                                <div className="flex justify-between text-xs"><span className="text-sonara-text-muted">Est. Return</span><span className="text-sonara-text font-mono">${(parseFloat(investAmt) * (1 + selected.apy / 100)).toFixed(0)}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-sonara-text-muted">Maturity</span><span className="text-sonara-text">{new Date(selected.maturityDate).toLocaleDateString()}</span></div>
                            </div>
                            <button
                                onClick={() => {
                                    const amount = parseFloat(investAmt);
                                    if (isNaN(amount) || amount <= 0) {
                                        alert("Please enter a valid amount.");
                                        return;
                                    }
                                    const success = useEconomyStore.getState().investBond(selected.id, selected.albumTitle, amount);
                                    if (success) {
                                        alert(`Successfully invested $${amount} in ${selected.albumTitle}!`);
                                        setShowModal(null);
                                    } else {
                                        alert("Insufficient funds!");
                                    }
                                }}
                                className="w-full btn-primary py-3 justify-center hover:scale-105 active:scale-95 transition-transform"
                            >
                                <DollarSign className="w-5 h-5" /> Confirm Investment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
