import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                sonara: {
                    bg: "#120024",       // Deep Violet
                    surface: "#1a0533",  // Darker Violet
                    card: "#22083d",     // Card Violet
                    border: "#3b1260",   // Border Violet
                    "border-glow": "#a855f7",
                    primary: "#a855f7",  // Purple-500
                    "primary-light": "#d8b4fe",
                    secondary: "#d946ef", // Magenta-500 (formerly Cyan)
                    accent: "#f0abfc",    // Pink-300
                    success: "#10b981",
                    warning: "#f59e0b",
                    danger: "#ef4444",
                    text: "#f0e0ff",      // Lavender
                    "text-dim": "#c9a8e8",
                    "text-muted": "#9b72c7",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Outfit", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "sonara-glow":
                    "linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #f0abfc 100%)",
                "sonara-dark":
                    "linear-gradient(180deg, #120024 0%, #1a0533 50%, #22083d 100%)",
                "card-gradient":
                    "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(217,70,239,0.05) 100%)",
            },
            boxShadow: {
                glow: "0 0 20px rgba(168, 85, 247, 0.3)",
                "glow-lg": "0 0 40px rgba(168, 85, 247, 0.4)",
                "glow-cyan": "0 0 20px rgba(217, 70, 239, 0.3)", // Now Magenta
                "glow-pink": "0 0 20px rgba(240, 171, 252, 0.3)",
                glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
            },
            animation: {
                "pulse-glow": "pulseGlow 3s ease-in-out infinite",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-in": "slideIn 0.3s ease-out",
                float: "float 6s ease-in-out infinite",
                shimmer: "shimmer 2s linear infinite",
                "spin-slow": "spin 8s linear infinite",
            },
            keyframes: {
                pulseGlow: {
                    "0%, 100%": { opacity: "0.4" },
                    "50%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateX(-10px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
