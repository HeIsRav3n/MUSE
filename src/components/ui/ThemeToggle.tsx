"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles, Monitor } from "lucide-react";

type Theme = "dark" | "light" | "system";

const themeIcons = {
    dark: Moon,
    light: Sun,
    system: Monitor,
};

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let saved = (localStorage.getItem("muse_theme") as Theme);
        if (!["dark", "light", "system"].includes(saved)) {
            saved = "dark";
        }
        setTheme(saved);
        applyTheme(saved);
    }, []);

    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        root.classList.remove("theme-light", "theme-dark");
        if (t === "system") {
            const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(`theme-${sys}`);
        } else {
            root.classList.add(`theme-${t}`);
        }
        localStorage.setItem("muse_theme", t);
    };

    const cycle = () => {
        const order: Theme[] = ["dark", "light", "system"];
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
            <Icon className="w-5 h-5 text-muse-text-dim
" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-muse-surface
 text-muse-text text-[10px] py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50 border border-muse-border
">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
        </button>
    );
}
