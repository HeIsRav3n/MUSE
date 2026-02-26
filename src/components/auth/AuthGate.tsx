"use client";

import { useAudiusAuth } from "@/context/AudiusAuthContext";
import { usePathname } from "next/navigation";
import { Music, Headphones, TrendingUp, Coins, Radio, Sparkles } from "lucide-react";

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
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sonara-primary flex items-center justify-center animate-pulse-glow">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/sonara-logo.jpg" alt="" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sonara-primary animate-pulse" />
                        <p className="text-sm text-sonara-text-muted">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Not logged in → show Spotify-style login wall
    if (!isLoggedIn) {
        return (
            <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/8 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                    {/* Logo & brand */}
                    <div className="flex flex-col items-center mb-12 animate-slide-up">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-2 ring-sonara-primary/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/sonara-logo.jpg" alt="SONARA" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="font-display font-bold text-5xl text-white mb-2 tracking-tight">SONARA</h1>
                        <p className="text-sonara-text-muted text-sm font-medium tracking-widest uppercase">Music Protocol</p>
                    </div>

                    {/* Tagline */}
                    <div className="text-center mb-10 max-w-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <h2 className="text-xl font-display font-bold text-white mb-3">
                            Discover. Invest. Earn.
                        </h2>
                        <p className="text-sm text-sonara-text-dim leading-relaxed">
                            The decentralized music economy powered by Audius.
                            Scout emerging artists, trade coins, and earn rewards.
                        </p>
                    </div>

                    {/* Feature pills — Spotify card style */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-12 max-w-md w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        {[
                            { icon: Music, label: "Music Discovery" },
                            { icon: TrendingUp, label: "Artist Scanner" },
                            { icon: Coins, label: "Artist Coins" },
                            { icon: Headphones, label: "Live Radio" },
                            { icon: Radio, label: "Party Rooms" },
                            { icon: Sparkles, label: "AI DJ Mode" },
                        ].map((f) => (
                            <div key={f.label} className="bg-[#181818] rounded-lg px-3 py-3 flex items-center gap-2.5 border border-white/5 hover:bg-[#282828] transition-colors">
                                <f.icon className="w-4 h-4 text-sonara-primary flex-shrink-0" />
                                <span className="text-xs text-[#b3b3b3] font-medium">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Login button — Spotify green pill */}
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <button
                            onClick={login}
                            className="px-10 py-3.5 rounded-full font-display font-bold text-black text-base
                                       bg-[#1DB954] hover:bg-[#1ed760] hover:scale-[1.04]
                                       active:scale-[0.98] transition-all duration-200
                                       flex items-center gap-3"
                        >
                            <Music className="w-5 h-5" />
                            Sign in with Audius
                        </button>
                        <p className="text-xs text-[#727272]">
                            Free account • No wallet required
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-48 h-px bg-white/5 my-8" />

                    {/* Footer */}
                    <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <p className="text-[10px] text-[#727272]">
                            Built By <span className="font-semibold text-white">Rav3n</span> • Powered By{" "}
                            <a href="https://audius.co" target="_blank" rel="noopener noreferrer" className="text-[#1DB954] hover:underline">
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
