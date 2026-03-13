"use client";

import { useState, useEffect, type ReactNode } from "react";
import { UserGuideModal } from "@/components/ui/UserGuideModal";
import { AIDJOverlay } from "@/components/player/AIDJOverlay";

export function LayoutShell({ children }: { children: ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        // Read initial state from localStorage
        const saved = localStorage.getItem("muse-sidebar-collapsed");
        if (saved === "true") setSidebarCollapsed(true);

        // Show guide on first visit
        const guideSeen = localStorage.getItem("muse_guide_seen");
        if (!guideSeen) setShowGuide(true);

        // Listen for sidebar toggle events
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setSidebarCollapsed(detail.collapsed);
        };
        window.addEventListener("sidebar-toggle", handler);
        return () => window.removeEventListener("sidebar-toggle", handler);
    }, []);

    const paddingClass = sidebarCollapsed
        ? "pl-[72px]"
        : "pl-[72px] lg:pl-[260px]";

    return (
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${paddingClass}`}>
            <div className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative z-10">
                {children}
            </div>
            {showGuide && <UserGuideModal onClose={() => setShowGuide(false)} />}
            <AIDJOverlay />
        </div>
    );
}
