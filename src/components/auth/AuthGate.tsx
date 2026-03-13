"use client";

import { useAudiusAuth } from "@/context/AudiusAuthContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Music, Headphones, TrendingUp, Wallet, Compass, Users, Mic2, Heart, ScanSearch } from "lucide-react";

// Routes that don't require authentication
const PUBLIC_ROUTES = [] as string[];

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
                <div className="flex flex-col items-center gap-6">
                    <motion.div 
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                            filter: [
                                "drop-shadow(0 0 15px rgba(224, 36, 195, 0.4))",
                                "drop-shadow(0 0 30px rgba(224, 36, 195, 0.7))",
                                "drop-shadow(0 0 15px rgba(224, 36, 195, 0.4))"
                            ]
                        }}
                        transition={{ 
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A0B2E] to-[#4B1059] flex items-center justify-center shadow-glow-pink border border-muse-primary/30 relative overflow-hidden"
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute z-10 opacity-70">
                            <path d="M5 35L15 15L20 25L30 5L35 15" stroke="url(#loading_anim_paint0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 30L15 20L20 28L28 12.5" stroke="url(#loading_anim_paint1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                            <defs>
                                <linearGradient id="loading_anim_paint0" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#e024c3" />
                                    <stop offset="0.5" stopColor="#ffb800" />
                                    <stop offset="1" stopColor="#6333ff" />
                                </linearGradient>
                                <linearGradient id="loading_anim_paint1" x1="10" y1="12.5" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffb800" />
                                    <stop offset="1" stopColor="#e024c3" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="font-display font-black text-3xl text-white z-20 drop-shadow-md">M</span>
                        <div className="absolute inset-0 bg-muse-primary/10 animate-pulse-glow" />
                    </motion.div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-muse-primary" 
                            />
                            <p className="text-xs text-muse-text-muted font-bold uppercase tracking-[0.3em]">Loading Muse</p>
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                className="w-1.5 h-1.5 rounded-full bg-muse-primary" 
                            />
                        </div>
                        <p className="text-[10px] text-muse-text-dim/60 uppercase tracking-widest font-medium">Entering the Music Economy</p>
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
                <div className="absolute inset-0 bg-gradient-to-b from-muse-primary/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                    {/* Logo & brand */}
                    <div className="flex flex-col items-center mb-12 animate-slide-up">
                        <motion.div 
                            animate={{ 
                                y: [0, -25, 0],
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                                filter: [
                                    "drop-shadow(0 0 20px rgba(224, 36, 195, 0.4))",
                                    "drop-shadow(0 0 40px rgba(224, 36, 195, 0.8))",
                                    "drop-shadow(0 0 20px rgba(224, 36, 195, 0.4))"
                                ]
                            }}
                            transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.5, 1]
                            }}
                            className="w-44 h-44 rounded-[3rem] overflow-hidden mb-8 ring-4 ring-muse-primary/40 shadow-glow-lg flex items-center justify-center bg-gradient-to-br from-[#1A0B2E] to-[#4B1059] p-1 border border-muse-primary/40 relative"
                        >
                            <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute z-10 opacity-40">
                                <path d="M5 35L15 15L20 25L30 5L35 15" stroke="url(#landing_paint0)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 30L15 20L20 28L28 12.5" stroke="url(#landing_paint1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                                <defs>
                                    <linearGradient id="landing_paint0" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#e024c3" />
                                        <stop offset="0.5" stopColor="#ffb800" />
                                        <stop offset="1" stopColor="#6333ff" />
                                    </linearGradient>
                                    <linearGradient id="landing_paint1" x1="10" y1="12.5" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#ffb800" />
                                        <stop offset="1" stopColor="#e024c3" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="font-display font-black text-7xl text-white z-20 drop-shadow-[0_0_30px_rgba(224,36,195,0.8)]">M</span>
                            <div className="absolute inset-0 bg-gradient-to-t from-muse-primary/20 to-transparent pointer-events-none" />
                        </motion.div>
                        <h1 className="font-display font-bold text-7xl text-white mb-2 tracking-tighter gradient-text drop-shadow-[0_0_20px_rgba(224,36,195,0.4)]">MUSE</h1>
                        <p className="text-muse-text-dim text-sm font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                             <Heart className="w-4 h-4 text-muse-primary fill-muse-primary animate-pulse" /> 
                             Womanly Season 
                             <Heart className="w-4 h-4 text-muse-primary fill-muse-primary animate-pulse" />
                        </p>
                    </div>

                    {/* Tagline */}
                    <div className="text-center mb-10 max-w-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">
                            Discover. Empower. Invest.
                        </h2>
                        <p className="text-sm text-muse-text-muted leading-relaxed font-medium">
                            The decentralized music economy tailored for the next generation of women creators. 
                            Trade artist coins, join exclusive parties, and earn rewards.
                        </p>
                    </div>

                    {/* Feature pills — MUSE Branding */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-12 max-w-md w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        {[
                            { icon: Compass, label: "Discover Women" },
                            { icon: ScanSearch, label: "Trend Scanner" },
                            { icon: Wallet, label: "Digital Wallet" },
                            { icon: Users, label: "Listening Party" },
                            { icon: Mic2, label: "Her Story Podcasts" },
                            { icon: Heart, label: "Wellness Audio" },
                        ].map((f) => (
                            <div key={f.label} className="bg-muse-card/40 backdrop-blur-md rounded-xl px-3 py-3 flex items-center gap-2.5 border border-white/5 hover:bg-muse-card/60 transition-colors">
                                <f.icon className="w-4 h-4 text-muse-primary flex-shrink-0" />
                                <span className="text-[10px] text-muse-text-dim font-bold uppercase tracking-wider">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Login button — MUSE Pink Pill */}
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <button
                            onClick={login}
                            className="px-10 py-3.5 rounded-full font-display font-bold text-white text-base
                                       bg-muse-primary hover:bg-muse-primary-light hover:scale-[1.04]
                                       active:scale-[0.98] transition-all duration-200
                                       flex items-center gap-3 shadow-glow-pink"
                        >
                            <Music className="w-5 h-5 flex-shrink-0" />
                            Sign in with Audius
                        </button>
                        <p className="text-[10px] text-muse-text-muted uppercase tracking-[0.2em] font-bold">
                            Secure Authentication • Powered by Web3
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-48 h-px bg-gradient-to-r from-transparent via-muse-primary/30 to-transparent my-10" />

                    {/* Footer */}
                    <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <p className="text-[10px] text-muse-text-dim">
                            Built By <span className="font-semibold text-white">Rav3n</span> • Using{" "}
                            <a href="https://audius.co" target="_blank" rel="noopener noreferrer" className="text-muse-primary-light hover:underline font-bold">
                                Audius Protocol
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
