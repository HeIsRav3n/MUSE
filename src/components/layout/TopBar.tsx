"use client";

import { Search, TrendingUp, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformStats } from "@/lib/mockData";
import { formatNumber, formatPercent } from "@/lib/web3";
import { useAudiusAuth } from "@/context/AudiusAuthContext";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TokenBalance } from "@/components/ui/TokenBalance";

export function TopBar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { user, isLoggedIn, login, logout } = useAudiusAuth();

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        // Navigate to discover page with search query
        router.push(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="sticky top-0 z-40 h-[72px] glass-strong border-b border-white/[0.08] flex items-center justify-between px-4 lg:px-6 gap-4 w-full">
            {/* Search */}
            <div className={`relative flex-1 max-w-md transition-all duration-300 ${searchFocused ? 'max-w-lg' : 'max-w-[160px] sm:max-w-md'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sonara-text-muted" />
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sonara-surface border border-sonara-border text-sm text-sonara-text placeholder:text-sonara-text-muted focus:outline-none focus:border-sonara-primary/50 focus:ring-1 focus:ring-sonara-primary/20 transition-all"
                />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 lg:gap-3">
                {/* $SOUND Price Ticker */}
                <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-sonara-glow flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">S</span>
                    </div>
                    <div>
                        <p className="text-xs font-mono font-bold text-sonara-text">${platformStats.soundPrice.toFixed(2)}</p>
                    </div>
                    <span className={`text-xs font-mono font-semibold ${platformStats.soundPriceChange >= 0 ? 'text-sonara-success' : 'text-sonara-danger'}`}>
                        {formatPercent(platformStats.soundPriceChange)}
                    </span>
                </div>

                {/* TVL */}
                <div className="hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-2">
                    <TrendingUp className="w-4 h-4 text-sonara-secondary" />
                    <div>
                        <p className="text-[10px] text-sonara-text-muted">TVL</p>
                        <p className="text-xs font-mono font-bold text-sonara-text">${formatNumber(platformStats.tvl)}</p>
                    </div>
                </div>

                {/* Token Balance */}
                <div className="hidden md:block">
                    <TokenBalance />
                </div>

                {/* Notifications */}
                <NotificationCenter />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Audius Auth */}
                {isLoggedIn && user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/5 transition-all"
                        >
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-sonara-primary to-sonara-secondary flex items-center justify-center flex-shrink-0">
                                {user.profilePicture?.["150x150"] ? (
                                    <img src={user.profilePicture["150x150"]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-bold text-white">{user.name[0]}</span>
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-sonara-text leading-tight">{user.name}</p>
                                <p className="text-[10px] text-sonara-text-muted leading-tight">@{user.handle}</p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-sonara-text-muted hidden sm:block" />
                        </button>
                        {showDropdown && (
                            <>
                                <div className="fixed inset-0 z-50" onClick={() => setShowDropdown(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl border border-sonara-border/50 p-2 z-50 animate-slide-up">
                                    <div className="px-3 py-2 border-b border-sonara-border/50 mb-1">
                                        <p className="text-xs font-semibold text-sonara-text">{user.name}</p>
                                        <p className="text-[10px] text-sonara-text-muted">@{user.handle}</p>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setShowDropdown(false); }}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sonara-danger hover:bg-sonara-danger/10 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" /> Log Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button onClick={login} className="btn-primary">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Log in with Audius</span>
                    </button>
                )}
            </div>
        </header>
    );
}
