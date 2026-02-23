"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Music, TrendingUp, Star, Wallet, Settings, ExternalLink } from "lucide-react";

export default function TelegramMiniApp() {
    const [isTelegram, setIsTelegram] = useState(false);
    const [tg, setTg] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if we're in Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            setIsTelegram(true);
            const webApp = window.Telegram.WebApp;
            setTg(webApp);
            
            // Initialize Telegram WebApp
            webApp.ready();
            webApp.expand();
            webApp.enableClosingConfirmation();
            
            // Set theme colors
            document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor);
            document.documentElement.style.setProperty('--tg-theme-text-color', webApp.textColor);
            document.documentElement.style.setProperty('--tg-theme-button-color', webApp.buttonColor);
            document.documentElement.style.setProperty('--tg-theme-button-text-color', webApp.buttonTextColor);
            
            // Set background color
            document.body.style.backgroundColor = webApp.backgroundColor;
        }
    }, []);

    const navigateTo = (path: string) => {
        if (isTelegram && tg) {
            tg.showPopup({
                title: "Opening Feature",
                message: "This feature will open in the main app.",
                buttons: [{ type: "ok" }]
            });
        }
        router.push(path);
    };

    const openExternal = (url: string) => {
        if (isTelegram && tg) {
            tg.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    };

    const features = [
        {
            icon: Music,
            title: "Music Discovery",
            description: "Discover trending tracks and new releases",
            action: () => navigateTo("/discover")
        },
        {
            icon: TrendingUp,
            title: "Trending",
            description: "See what's hot in the music world",
            action: () => navigateTo("/discover?filter=trending")
        },
        {
            icon: Star,
            title: "Favorites",
            description: "Your saved tracks and artists",
            action: () => navigateTo("/library")
        },
        {
            icon: Wallet,
            title: "Portfolio",
            description: "Track your investments and earnings",
            action: () => navigateTo("/portfolio")
        },
        {
            icon: Settings,
            title: "Settings",
            description: "Customize your experience",
            action: () => navigateTo("/settings")
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sonara-primary/10 to-sonara-secondary/10">
            {/* Header */}
            <div className="bg-sonara-surface/80 backdrop-blur-md border-b border-sonara-border/50 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-sonara-primary to-sonara-secondary rounded-lg flex items-center justify-center">
                                <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-sonara-text">SONARA</h1>
                                <p className="text-xs text-sonara-text-muted">Music Protocol</p>
                            </div>
                        </div>
                        
                        {isTelegram && (
                            <button
                                onClick={() => tg?.close()}
                                className="px-3 py-1.5 text-xs bg-sonara-danger/20 text-sonara-danger rounded-lg hover:bg-sonara-danger/30 transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-sonara-text mb-2">
                        Welcome to SONARA
                    </h2>
                    <p className="text-sonara-text-muted mb-6">
                        Discover, invest, and earn in the decentralized music economy
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-sonara-surface/50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-sonara-primary mb-1">1.2M</div>
                            <div className="text-xs text-sonara-text-muted">Monthly Listeners</div>
                        </div>
                        <div className="bg-sonara-surface/50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-sonara-secondary mb-1">$4.5M</div>
                            <div className="text-xs text-sonara-text-muted">Artist Funding</div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid gap-3 mb-8">
                    {features.map((feature, index) => (
                        <button
                            key={index}
                            onClick={feature.action}
                            className="bg-sonara-surface/50 hover:bg-sonara-surface/70 border border-sonara-border/30 rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-sonara-primary/20 to-sonara-secondary/20 rounded-lg flex items-center justify-center">
                                    <feature.icon className="w-5 h-5 text-sonara-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sonara-text">{feature.title}</h3>
                                    <p className="text-xs text-sonara-text-muted">{feature.description}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-sonara-text-muted" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-sonara-primary/10 to-sonara-secondary/10 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-sonara-text mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => openExternal("https://app.sonara.music")}
                            className="bg-sonara-primary text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-sonara-primary-light transition-colors"
                        >
                            Open Full App
                        </button>
                        <button
                            onClick={() => openExternal("https://t.me/sonara_bot")}
                            className="bg-sonara-surface border border-sonara-border text-sonara-text text-sm font-medium py-2 px-3 rounded-lg hover:bg-sonara-surface/80 transition-colors"
                        >
                            Talk to Bot
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-sonara-text-muted mb-2">
                        Powered by Audius • Built with ❤️ for music lovers
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => openExternal("https://twitter.com/sonara_music")}
                            className="text-xs text-sonara-text-muted hover:text-sonara-primary transition-colors"
                        >
                            Twitter
                        </button>
                        <button
                            onClick={() => openExternal("https://docs.sonara.music")}
                            className="text-xs text-sonara-text-muted hover:text-sonara-primary transition-colors"
                        >
                            Docs
                        </button>
                        <button
                            onClick={() => openExternal("https://github.com/sonara")}
                            className="text-xs text-sonara-text-muted hover:text-sonara-primary transition-colors"
                        >
                            GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}