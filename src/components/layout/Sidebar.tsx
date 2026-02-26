"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Compass,
    Coins,
    Store,
    Landmark,
    PieChart,
    Settings,
    Radio,
    ScanSearch,
    Users,
    Trophy,
    BookOpen,
    ChevronsLeft,
    ChevronsRight,
    ChevronDown,
    type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

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
            { href: "/scanner", label: "Scanner", icon: ScanSearch },
            { href: "/discover", label: "Discover", icon: Compass },
            { href: "/radio", label: "Live Radio", icon: Radio },
            { href: "/party", label: "Party Room", icon: Users },
        ],
    },
    {
        title: "Finance",
        items: [
            { href: "/coins", label: "Artist Coins", icon: Coins },
            { href: "/marketplace", label: "Marketplace", icon: Store },
            { href: "/bonds", label: "Album Bonds", icon: Landmark },
            { href: "/bounties", label: "Discovery Bounties", icon: Trophy },
            { href: "/portfolio", label: "Portfolio", icon: PieChart },
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

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    // Sync initial state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sonara-sidebar-collapsed");
        if (saved === "true") setCollapsed(true);
        const savedSections = localStorage.getItem("sonara-sidebar-sections");
        if (savedSections) {
            try { setCollapsedSections(JSON.parse(savedSections)); } catch { /* ignore */ }
        }
    }, []);

    const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("sonara-sidebar-collapsed", String(next));
        window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { collapsed: next } }));
    };

    const toggleSection = (title: string) => {
        setCollapsedSections((prev) => {
            const next = { ...prev, [title]: !prev[title] };
            localStorage.setItem("sonara-sidebar-sections", JSON.stringify(next));
            return next;
        });
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen glass-strong z-50 flex flex-col transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[72px] lg:w-[260px]"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-[72px] border-b border-sonara-border/50 overflow-hidden">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-sonara-glow flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/sonara-logo.jpg"
                        alt="SONARA"
                        className="w-full h-full object-cover"
                    />
                </div>
                {!collapsed && (
                    <div className="hidden lg:block">
                        <h1 className="font-display font-bold text-lg gradient-text">SONARA</h1>
                        <p className="text-[10px] text-sonara-text-muted tracking-widest uppercase">Web3 Music</p>
                    </div>
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
                                    <span className="text-[10px] uppercase tracking-widest text-sonara-text-muted font-semibold group-hover:text-sonara-text-dim transition">
                                        {section.title}
                                    </span>
                                    <ChevronDown
                                        className={`w-3 h-3 text-sonara-text-muted group-hover:text-sonara-text-dim transition-transform duration-200 ${isSectionCollapsed ? "-rotate-90" : ""
                                            }`}
                                    />
                                    {/* Active indicator dot when section is collapsed */}
                                    {isSectionCollapsed && hasActiveItem && (
                                        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-sonara-primary animate-pulse" />
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
                                                ? "bg-sonara-primary/15 text-sonara-primary-light"
                                                : "text-sonara-text-dim hover:text-sonara-text hover:bg-white/5"
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-sonara-primary rounded-r-full" />
                                            )}
                                            <item.icon
                                                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-sonara-primary-light" : "text-sonara-text-muted group-hover:text-sonara-text-dim"
                                                    }`}
                                            />
                                            {!collapsed && (
                                                <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                                            )}
                                            {isActive && !collapsed && (
                                                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-sonara-primary animate-pulse" />
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
            <div className="p-3 border-t border-sonara-border/50 space-y-2">
                {!collapsed && (
                    <Link href="/portfolio" className="hidden lg:block glass rounded-xl p-3 mb-1 hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-sonara-text-muted group-hover:text-sonara-text-dim transition">Staked $SOUND</span>
                            <span className="text-xs font-mono text-sonara-success">+6.8%</span>
                        </div>
                        <p className="text-sm font-bold text-sonara-text">25,000 $SOUND</p>
                        <div className="w-full h-1 bg-sonara-border rounded-full mt-2">
                            <div className="h-full w-[65%] bg-sonara-glow rounded-full" />
                        </div>
                        <p className="text-[10px] text-sonara-text-muted mt-1">Gold Tier — 65% to Platinum</p>
                    </Link>
                )}

                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname === "/settings"
                        ? "bg-sonara-primary/15 text-sonara-primary-light"
                        : "text-sonara-text-muted hover:text-sonara-text hover:bg-white/5"
                        }`}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                    {!collapsed && <span className="hidden lg:block text-sm">Settings</span>}
                </Link>

                {/* Collapse toggle */}
                <button
                    onClick={toggle}
                    className="flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-sonara-text-muted hover:text-sonara-text hover:bg-white/5 w-full transition-all"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
                    {!collapsed && <span className="hidden lg:block text-sm">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}
