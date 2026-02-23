"use client";

import { useState, useEffect } from "react";
import {
    X, Sparkles, Music2, Headphones, BarChart3, Radio,
    Coins, Store, Users, ChevronRight, Rocket, Zap,
    Shield, Heart, ArrowRight, Star, Globe, Trophy, Check,
} from "lucide-react";

interface GuideStep {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const guideSteps: GuideStep[] = [
    {
        icon: <Music2 className="w-6 h-6" />,
        title: "Stream & Discover",
        description: "Browse trending tracks, discover new artists, and stream music powered by the Audius decentralized protocol. All free, forever.",
        color: "from-purple-500 to-violet-600",
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Scanner & Analytics",
        description: "Real-time market analytics for music tokens. Track prices, volume, and sentiment across the Web3 music ecosystem.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: <Coins className="w-6 h-6" />,
        title: "Artist Coins & Bonds",
        description: "Invest in your favorite artists through tokenized coins and album bonds. Earn as they grow — you're an early believer.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: <Store className="w-6 h-6" />,
        title: "NFT Marketplace",
        description: "Collect rare music NFTs, limited drops, and exclusive releases. Own a piece of music history on-chain.",
        color: "from-pink-500 to-rose-500",
    },
    {
        icon: <Radio className="w-6 h-6" />,
        title: "Party Rooms",
        description: "Listen together in real-time party rooms. Vote on tracks, chat with fans, and vibe with the community.",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "AI-DJ Mode",
        description: "Let our AI mix your vibe. Auto-queues tracks based on your mood and creates seamless transitions.",
        color: "from-yellow-500 to-orange-500",
    },
    {
        icon: <Radio className="w-6 h-6" />,
        title: "Live Radio & Tipping",
        description: "Tune into community-curated stations. Tip $SOUND to request tracks and support the DJs.",
        color: "from-cyan-500 to-blue-500",
    },
    {
        icon: <Trophy className="w-6 h-6" />,
        title: "Discovery Bounties",
        description: "Earn $SOUND by finding rare tracks and completing music discovery challenges.",
        color: "from-pink-500 to-rose-500",
    },
    {
        icon: <Headphones className="w-6 h-6" />,
        title: "Expanded Player",
        description: "Click the expand icon on any playing track for the full immersive experience — visualizers, lyrics, and controls.",
        color: "from-fuchsia-500 to-purple-600",
    },
];

const proTips = [
    { icon: <Zap className="w-4 h-4" />, tip: "Use keyboard shortcuts: Space for play/pause, ← → for skip" },
    { icon: <Shield className="w-4 h-4" />, tip: "Your data stays decentralized — powered by Audius" },
    { icon: <Star className="w-4 h-4" />, tip: "Stake $SOUND tokens to unlock premium features and rewards" },
    { icon: <Globe className="w-4 h-4" />, tip: "Switch visualizer modes in the player settings ⚙️" },
    { icon: <Zap className="w-4 h-4" />, tip: "Enable AI-DJ in settings for non-stop music" },
];

export function UserGuideModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        if (dontShowAgain) {
            localStorage.setItem("sonara_guide_seen", "true");
        }
        setTimeout(onClose, 300);
    };

    const isLastStep = step === guideSteps.length;
    const current = guideSteps[step];

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

            {/* Modal */}
            <div className={`relative w-full max-w-lg mx-4 transition-all duration-500 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl blur-xl" />

                <div className="relative bg-sonara-card border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header — gradient banner */}
                    <div className="relative h-32 bg-gradient-to-br from-purple-900/80 via-fuchsia-900/60 to-purple-900/40 overflow-hidden">
                        {/* Floating particles */}
                        <div className="absolute inset-0">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 rounded-full bg-white/20 animate-pulse"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${2 + Math.random() * 3}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                                    <Rocket className="w-6 h-6 text-white" />
                                    <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
                                </div>
                                <h2 className="text-xl font-display font-bold text-white">Welcome to SONARA</h2>
                                <p className="text-xs text-purple-200/80 mt-1">Your Gateway to Web3 Music</p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Step dots */}
                    <div className="flex justify-center gap-1.5 py-3">
                        {guideSteps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? "w-6 bg-sonara-primary" : i < step ? "w-1.5 bg-sonara-primary/40" : "w-1.5 bg-white/15"}`}
                            />
                        ))}
                        <button
                            onClick={() => setStep(guideSteps.length)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${isLastStep ? "w-6 bg-sonara-primary" : "w-1.5 bg-white/15"}`}
                        />
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 min-h-[280px] flex flex-col">
                        {!isLastStep && current ? (
                            <div className="flex-1 flex flex-col items-center text-center animate-fade-in" key={step}>
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                                    {current.icon}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{current.title}</h3>
                                <p className="text-sm text-sonara-text-muted leading-relaxed max-w-sm">
                                    {current.description}
                                </p>

                                {/* Step counter */}
                                <p className="text-[10px] text-sonara-text-muted mt-4 uppercase tracking-widest">
                                    {step + 1} of {guideSteps.length}
                                </p>
                            </div>
                        ) : (
                            /* Pro Tips page */
                            <div className="flex-1 animate-fade-in" key="tips">
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="w-5 h-5 text-pink-400" />
                                    <h3 className="text-lg font-bold text-white">Pro Tips</h3>
                                </div>
                                <div className="space-y-3">
                                    {proTips.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-8 h-8 rounded-lg bg-sonara-primary/20 flex items-center justify-center text-sonara-primary flex-shrink-0">
                                                {tip.icon}
                                            </div>
                                            <p className="text-xs text-sonara-text-dim leading-relaxed pt-1">{tip.tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex flex-col gap-4 mt-4 pt-3 border-t border-white/5">

                            {/* Do Not Show Again Checkbox */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDontShowAgain(!dontShowAgain)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${dontShowAgain ? "bg-sonara-primary border-sonara-primary" : "border-sonara-text-muted hover:border-sonara-text-dim"}`}
                                >
                                    {dontShowAgain && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <label onClick={() => setDontShowAgain(!dontShowAgain)} className="text-xs text-sonara-text-muted cursor-pointer hover:text-sonara-text-dim select-none">
                                    Do not show this again
                                </label>
                            </div>

                            <div className="flex items-center justify-between w-full">
                                {step > 0 ? (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-xs text-sonara-text-muted hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleClose}
                                        className="text-xs text-sonara-text-muted hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
                                    >
                                        Skip
                                    </button>
                                )}

                                {isLastStep ? (
                                    <button
                                        onClick={handleClose}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    >
                                        <span>Let&apos;s Go!</span>
                                        <Rocket className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
