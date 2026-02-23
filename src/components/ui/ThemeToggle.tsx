"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles, Monitor } from "lucide-react";

type Theme = "dark" | "light" | "neon" | "system";

const themeIcons = {
    dark: Moon,
    light: Sun,
    neon: Sparkles,
    system: Monitor,
};

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = (localStorage.getItem("sonara_theme") as Theme) || "dark";
        setTheme(saved);
        applyTheme(saved);
    }, []);

    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        root.classList.remove("theme-light", "theme-dark", "theme-neon");
        if (t === "system") {
            const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(`theme-${sys}`);
        } else {
            root.classList.add(`theme-${t}`);
        }
        localStorage.setItem("sonara_theme", t);
    };

    const cycle = () => {
        const order: Theme[] = ["dark", "light", "neon", "system"];
        const next = order[(order.indexOf(theme) + 1) % order.length];
        setTheme(next);
        applyTheme(next);
    };

    if (!mounted) return null;

    const Icon = themeIcons[theme];

    return (
        <button
            onClick={cycle}
            className="relative p-2.5 rounded-xl glass hover:bg-white/5 transition-all group"
            aria-label={`Theme: ${theme}`}
        >
            <Icon className={`w-5 h-5 ${theme === "neon" ? "text-purple-400" : "text-sonara-text-dim"}`} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sonara-surface text-sonara-text text-[10px] py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50 border border-sonara-border">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
        </button>
    );
}
