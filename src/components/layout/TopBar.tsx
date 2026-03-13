"use client";

import { Search, TrendingUp, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muse-text-muted" />
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muse-surface border border-muse-border text-sm text-muse-text placeholder:text-muse-text-muted focus:outline-none focus:border-muse-primary/50 focus:ring-1 focus:ring-muse-primary/20 transition-all"
                />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 lg:gap-3">
                {/* Notifications */}
                <NotificationCenter />

                {/* Token Balance */}
                <TokenBalance />

                {/* Premium Badge */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-muse-primary/20 to-muse-accent/20 border border-muse-primary/30 shadow-glow-pink animate-pulse">
                    <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-muse-primary-light to-muse-accent uppercase tracking-widest">Premium</span>
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Audius Auth */}
                {isLoggedIn && user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-muse-primary/10 transition-all"
                        >
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-muse-primary to-muse-secondary flex items-center justify-center flex-shrink-0">
                                {user.profilePicture?.["150x150"] ? (
                                    <img src={user.profilePicture["150x150"]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-bold text-white">{user.name[0]}</span>
                                )}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-muse-text leading-tight">{user.name}</p>
                                <p className="text-[10px] text-muse-text-muted leading-tight">@{user.handle}</p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-muse-text-muted hidden sm:block" />
                        </button>
                        {showDropdown && (
                            <>
                                <div className="fixed inset-0 z-50" onClick={() => setShowDropdown(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl border border-muse-border/50 p-2 z-50 animate-slide-up">
                                    <div className="px-3 py-2 border-b border-muse-border/50 mb-1">
                                        <p className="text-xs font-semibold text-muse-text">{user.name}</p>
                                        <p className="text-[10px] text-muse-text-muted">@{user.handle}</p>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setShowDropdown(false); }}
                                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muse-danger hover:bg-muse-danger/10 transition-all"
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
