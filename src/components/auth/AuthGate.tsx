"use client";

import { useAudiusAuth } from "@/context/AudiusAuthContext";
import { usePathname } from "next/navigation";
import { Music, Headphones, TrendingUp, Coins, Radio, Sparkles, LogIn } from "lucide-react";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/telegram"];

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isInitialized, login } = useAudiusAuth();
    const pathname = usePathname();

    // Allow public routes without auth
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return <>{children}</>;
    }

    // Show loading while checking auth state
    if (!isInitialized) {
        return (
            <div className="fixed inset-0 z-[100] bg-sonara-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sonara-glow flex items-center justify-center animate-pulse-glow">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/sonara-logo.jpg" alt="" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sonara-primary animate-pulse" />
                        <p className="text-sm text-sonara-text-muted">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Not logged in → show login wall
    if (!isLoggedIn) {
        return (
            <div className="fixed inset-0 z-[100] bg-sonara-bg overflow-y-auto">
                {/* Background orbs */}
                <div className="bg-orb bg-orb-1" />
                <div className="bg-orb bg-orb-2" />
                <div className="bg-orb bg-orb-3" />

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                    {/* Logo & brand */}
                    <div className="flex flex-col items-center mb-10 animate-slide-up">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 shadow-glow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/sonara-logo.jpg" alt="SONARA" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="font-display font-bold text-4xl gradient-text mb-2">SONARA</h1>
                        <p className="text-sonara-text-muted text-sm tracking-widest uppercase">Web3 Music Protocol</p>
                    </div>

                    {/* Tagline */}
                    <div className="text-center mb-10 max-w-md animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <h2 className="text-xl lg:text-2xl font-display font-semibold text-sonara-text mb-3">
                            Discover. Invest. Earn.
                        </h2>
                        <p className="text-sm text-sonara-text-dim leading-relaxed">
                            The decentralized music economy — powered by Audius.
                            Scout emerging artists, trade artist coins, and earn rewards.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-lg w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        {[
                            { icon: Music, label: "Music Discovery" },
                            { icon: TrendingUp, label: "Artist Scanner" },
                            { icon: Coins, label: "Artist Coins" },
                            { icon: Headphones, label: "Live Radio" },
                            { icon: Radio, label: "Party Rooms" },
                            { icon: Sparkles, label: "AI DJ Mode" },
                        ].map((f) => (
                            <div key={f.label} className="glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                                <f.icon className="w-4 h-4 text-sonara-primary flex-shrink-0" />
                                <span className="text-xs text-sonara-text-dim font-medium">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Login button */}
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <button
                            onClick={login}
                            className="group relative px-8 py-3.5 rounded-2xl font-display font-semibold text-white text-base
                                       bg-gradient-to-r from-sonara-primary via-sonara-secondary to-sonara-accent
                                       hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]
                                       flex items-center gap-3"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign in with Audius
                            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <p className="text-[11px] text-sonara-text-muted">
                            Free account • No wallet required
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <p className="text-[10px] text-sonara-text-muted">
                            Built By <span className="font-semibold text-sonara-primary">Rav3n</span> • Powered By{" "}
                            <a href="https://audius.co" target="_blank" rel="noopener noreferrer" className="text-sonara-accent hover:underline">
                                Audius
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Logged in → show app
    return <>{children}</>;
}
