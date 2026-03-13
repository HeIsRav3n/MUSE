"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Compass,
    Radio,
    ScanSearch,
    Users,
    BookOpen,
    Heart,
    Award,
    Mic2,
    Briefcase,
    ChevronsLeft,
    ChevronsRight,
    ChevronDown,
    Settings,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import React, { useState, useEffect, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioData, useAudioPlayback } from "@/lib/audioStore";

/* ─── Navigation definition with sections ─── */
interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: "Main",
        items: [
            { href: "/", label: "Dashboard", icon: LayoutDashboard },
            { href: "/scanner", label: "Trend Scanner", icon: ScanSearch },
            { href: "/discover", label: "Discover Women", icon: Compass },
            { href: "/wallet", label: "Wallet", icon: Wallet },
            { href: "/party", label: "Listening Party", icon: Users },
        ],
    },
    {
        title: "Women's Initiatives",
        items: [
            { href: "/podcasts", label: "Her Story Podcasts", icon: Mic2 },
            { href: "/grants", label: "Empower Grants", icon: Award },
            { href: "/wellness", label: "Wellness Audio", icon: Heart },
            { href: "/mentorship", label: "Mentorship Collabs", icon: Briefcase },
        ],
    },
    {
        title: "Social",
        items: [
            { href: "/friends", label: "Friends", icon: Users },
            { href: "/guide", label: "Guide & FAQ", icon: BookOpen },
        ],
    },
];

export const Sidebar = memo(function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const { isPlaying } = useAudioPlayback();
    const { analyserRef } = useAudioData();
    const [beat, setBeat] = useState(0);
    const beatRef = useRef(0);

    // Rhythm sync logic for logo
    useEffect(() => {
        if (!isPlaying || !analyserRef.current) {
            setBeat(0);
            return;
        }

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        let animationId: number;

        const updateBeat = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Sample low frequencies for beat
            const lowFreqs = dataArray.slice(0, 10);
            const avg = lowFreqs.reduce((a, b) => a + b, 0) / lowFreqs.length;
            const intensity = Math.pow(avg / 255, 1.5);
            
            beatRef.current = beatRef.current * 0.8 + intensity * 0.2;
            setBeat(beatRef.current);
            animationId = requestAnimationFrame(updateBeat);
        };

        animationId = requestAnimationFrame(updateBeat);
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying, analyserRef]);

    // Sync initial state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("muse-sidebar-collapsed");
        if (saved === "true") setCollapsed(true);
        const savedSections = localStorage.getItem("muse-sidebar-sections");
        if (savedSections) {
            try { setCollapsedSections(JSON.parse(savedSections)); } catch { /* ignore */ }
        }
    }, []);

    const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("muse-sidebar-collapsed", String(next));
        window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { collapsed: next } }));
    };

    const toggleSection = (title: string) => {
        setCollapsedSections((prev) => {
            const next = { ...prev, [title]: !prev[title] };
            localStorage.setItem("muse-sidebar-sections", JSON.stringify(next));
            return next;
        });
    };

    return (
        <aside
            className={`fixed left-0 top-0 glass-strong z-50 flex flex-col transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[72px] lg:w-[260px]"
                }`}
            style={{ height: 'calc(100vh - var(--player-height))' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-[72px] border-b border-muse-border/50 overflow-hidden">
                <motion.div 
                    className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1A0B2E] to-[#4B1059] flex items-center justify-center shadow-lg border border-[#e024c3]/30 relative group/logo"
                    animate={{
                        scale: isPlaying ? 1 + beat * 0.15 : [1, 1.05, 1],
                        rotate: isPlaying ? beat * 15 : [0, 5, -5, 0],
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ 
                        scale: isPlaying ? { type: "spring", stiffness: 300, damping: 15 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotate: isPlaying ? { type: "spring", stiffness: 300, damping: 10 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <motion.svg 
                        width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute"
                        animate={{
                            y: [0, -2, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <path d="M5 35L15 15L20 25L30 5L35 15" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 30L15 20L20 28L28 12.5" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                        <defs>
                            <linearGradient id="paint0_linear" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#e024c3" />
                                <stop offset="0.5" stopColor="#ffb800" />
                                <stop offset="1" stopColor="#6333ff" />
                            </linearGradient>
                            <linearGradient id="paint1_linear" x1="10" y1="12.5" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ffb800" />
                                <stop offset="1" stopColor="#e024c3" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                    <motion.span 
                        className="font-display font-black text-xl text-white z-10 drop-shadow-md"
                        animate={{
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        M
                    </motion.span>
                </motion.div>
                {!collapsed && (
                    <motion.div 
                        className="hidden lg:block"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="font-display font-bold text-lg gradient-text">MUSE</h1>
                        <p className="text-[10px] text-muse-text-muted tracking-widest uppercase">WHM '26</p>
                    </motion.div>
                )}
            </div>

            {/* Navigation with collapsible sections */}
            <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar space-y-1">
                {navSections.map((section) => {
                    const isSectionCollapsed = collapsedSections[section.title];
                    const hasActiveItem = section.items.some((item) => pathname === item.href);

                    return (
                        <div key={section.title}>
                            {/* Section header — only show when sidebar is expanded */}
                            {!collapsed && (
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="hidden lg:flex w-full items-center justify-between px-3 py-1.5 mb-0.5 group"
                                >
                                    <span className="text-[10px] uppercase tracking-widest text-muse-text-muted font-semibold group-hover:text-muse-text-dim transition">
                                        {section.title}
                                    </span>
                                    <ChevronDown
                                        className={`w-3 h-3 text-muse-text-muted group-hover:text-muse-text-dim transition-transform duration-200 ${isSectionCollapsed ? "-rotate-90" : ""
                                            }`}
                                    />
                                    {/* Active indicator dot when section is collapsed */}
                                    {isSectionCollapsed && hasActiveItem && (
                                        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-muse-primary animate-pulse" />
                                    )}
                                </button>
                            )}

                            {/* Section items — collapse animation */}
                            <div
                                className={`space-y-0.5 overflow-hidden transition-all duration-200 ${!collapsed && isSectionCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
                                    }`}
                            >
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={item.label}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                                ? "bg-muse-primary/15 text-muse-primary-light"
                                                : "text-muse-text-dim hover:text-muse-text hover:bg-muse-primary/10"
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-muse-primary rounded-r-full" />
                                            )}
                                            <item.icon
                                                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-muse-primary-light" : "text-muse-text-muted group-hover:text-muse-text-dim"
                                                    }`}
                                            />
                                            {!collapsed && (
                                                <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                                            )}
                                            {isActive && !collapsed && (
                                                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-muse-primary animate-pulse" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-3 border-t border-muse-border/50 space-y-2">


                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname === "/settings"
                        ? "bg-muse-primary/15 text-muse-primary-light"
                        : "text-muse-text-muted hover:text-muse-text hover:bg-muse-primary/10"
                        }`}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                    {!collapsed && <span className="hidden lg:block text-sm">Settings</span>}
                </Link>

                {/* Collapse toggle */}
                <button
                    onClick={toggle}
                    className="flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-muse-text-muted hover:text-muse-text hover:bg-muse-primary/10 w-full transition-all"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
                    {!collapsed && <span className="hidden lg:block text-sm">Collapse</span>}
                </button>
            </div>
        </aside>
    );
});
