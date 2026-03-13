"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  RefreshCw, 
  TrendingUp, 
  ArrowDownRight,
  Zap,
  DollarSign
} from 'lucide-react';
import { WalletBalanceChart } from '@/components/wallet/WalletBalanceChart';
import { AssetRow } from '@/components/wallet/AssetRow';
import { useEconomyStore } from '@/lib/economyStore';
import { formatNumber } from '@/lib/web3';
import { portfolioHoldings, portfolioHistory, artistCoins } from "@/lib/liveData";

export default function WalletPage() {
    const { balance, portfolio } = useEconomyStore();
    
    // Total Portfolio Value (Balance + Coin Values)
    // In a real app we'd fetch current prices. For now, use live prices.
    const totalCoinValue = Object.entries(portfolio.coins).reduce((acc, [id, amount]) => {
        const coin = (artistCoins as any[]).find(c => c.id === id);
        return acc + (amount * (coin?.price || 0));
    }, 0);
    
    const accountBalance = balance + totalCoinValue;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muse-primary to-muse-accent flex items-center justify-center shadow-glow-pink">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-white">Wallet</h1>
                        <p className="text-muse-text-muted text-sm">Manage your Muse economy & Audius assets</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition">
                        <Plus className="w-4 h-4" /> Add Funds
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition">
                        <Minus className="w-4 h-4" /> Withdraw
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-muse-primary text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition shadow-glow-pink">
                        <RefreshCw className="w-4 h-4" /> Swap Assets
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Balance & Chart Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="glass-strong rounded-[2.5rem] p-8 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-muse-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-muse-primary/20 transition-colors duration-700" />
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-muse-text-muted text-sm font-semibold tracking-wider uppercase">Current Balance</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-5xl lg:text-7xl font-display font-black text-white">${formatNumber(accountBalance)}</span>
                                        <span className="text-muse-text-dim text-xl font-mono">USD</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muse-success/10 text-muse-success text-xs font-bold">
                                        <ArrowDownRight className="w-3.5 h-3.5 rotate-180" /> 
                                        $428.12 (4.45%)
                                    </div>
                                    <p className="text-muse-text-dim text-[10px] mt-2 tracking-widest uppercase">7 Day Change</p>
                                </div>
                            </div>

                            <WalletBalanceChart />
                        </div>
                    </div>

                    {/* Discover Artist Coins (Grid form like mockup) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-muse-secondary" /> Discover Artist Coins
                            </h3>
                            <button className="text-xs text-muse-primary-light hover:underline font-bold">View Market</button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {artistCoins.slice(0, 4).map((coin, i) => (
                                <motion.div 
                                    key={coin.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass rounded-3xl p-5 group cursor-pointer hover:border-muse-primary/30 transition-all border border-transparent"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muse-primary/20 to-muse-accent/10 flex items-center justify-center border border-white/5 font-black text-muse-primary-light">
                                                {coin.symbol[1]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{coin.name}</h4>
                                                <p className="text-[10px] text-muse-text-muted uppercase tracking-widest">{coin.symbol}</p>
                                            </div>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Assets Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="glass-strong rounded-[2rem] p-6 flex flex-col h-full border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Your Assets</h3>
                            <button className="text-[10px] text-muse-text-muted hover:text-white uppercase tracking-widest font-bold">Manage</button>
                        </div>

                        <div className="space-y-1">
                            {/* Cash / USDC */}
                            <AssetRow 
                                name="Cash"
                                symbol="USDC"
                                balance={formatNumber(balance)}
                                fiatValue={formatNumber(balance)}
                                icon={(
                                    <div className="w-full h-full bg-[#2775ca] flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            />
                            
                            {/* Audius Coin */}
                            <AssetRow 
                                name="Audius Coin"
                                symbol="AUDIO"
                                balance="0"
                                fiatValue="0.00"
                                icon={(
                                    <div className="w-full h-full bg-gradient-to-br from-[#1b1b1b] to-[#444] flex items-center justify-center p-2">
                                         <svg viewBox="0 0 100 100" className="w-full h-full text-[#cc0fe0] fill-current">
                                            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                                         </svg>
                                    </div>
                                )}
                            />

                            {/* Owned Artist Coins */}
                            {Object.entries(portfolio.coins).map(([id, amount]) => {
                                const coin = artistCoins.find(c => c.id === id);
                                if (!coin) return null;
                                return (
                                    <AssetRow 
                                        key={id}
                                        name={coin.name}
                                        symbol={coin.symbol}
                                        balance={amount.toString()}
                                        fiatValue={formatNumber(amount * coin.price)}
                                        icon={(
                                            <div className="w-full h-full bg-muse-surface flex items-center justify-center font-black text-muse-primary-light">
                                                {coin.symbol[1]}
                                            </div>
                                        )}
                                    />
                                );
                            })}
                        </div>

                        {/* Faucet for testing */}
                        <div className="mt-auto pt-6">
                           <button 
                             onClick={() => useEconomyStore.getState().addFunds(1000, 'Demo Faucet')}
                             className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-muse-primary/10 to-muse-accent/10 border border-muse-primary/20 text-muse-primary-light text-xs font-bold hover:bg-muse-primary/20 transition-all flex items-center justify-center gap-2"
                           >
                             <Zap className="w-4 h-4" /> Get Free $1,000 (Demo Faucet)
                           </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
