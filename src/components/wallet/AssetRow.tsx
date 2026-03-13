"use client";

import { ChevronRight } from "lucide-react";
import React from "react";

interface AssetRowProps {
    icon: React.ReactNode;
    name: string;
    symbol: string;
    balance: string;
    fiatValue: string;
    onClick?: () => void;
}

export function AssetRow({ icon, name, symbol, balance, fiatValue, onClick }: AssetRowProps) {
    return (
        <div 
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
        >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muse-surface border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                {icon}
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-muse-primary-light transition-colors">{name}</h4>
                <p className="text-xs text-muse-text-muted">{balance} {symbol}</p>
            </div>
            
            <div className="text-right flex items-center gap-3">
                <p className="text-sm font-bold text-white font-mono">${fiatValue}</p>
                <ChevronRight className="w-4 h-4 text-muse-text-dim group-hover:text-white transition-colors" />
            </div>
        </div>
    );
}
