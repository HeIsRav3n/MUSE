"use client";

import { useAudioData, useAudioPlayback } from "@/lib/audioStore";
import { Sparkles, Zap, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export function AIDJOverlay() {
    const { aiDjMode, currentTrack } = useAudioData();
    const { isPlaying } = useAudioPlayback();
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    // Simulated DJ commentary logic
    useEffect(() => {
        if (!aiDjMode || !isPlaying || !currentTrack) {
            setVisible(false);
            return;
        }

        // Show overlay briefly at start of track
        setVisible(true);
        const msgs = [
            `Mixing in ${currentTrack.title}...`,
            "Matching the vibe...",
            "Syncing BPM...",
            "Transitioning...",
            "Curating next banger...",
        ];
        setMessage(msgs[Math.floor(Math.random() * msgs.length)]);

        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [aiDjMode, currentTrack?.id, isPlaying]);

    if (!aiDjMode) return null;

    return (
        <div className={`fixed top-24 right-6 z-40 transition-all duration-700 transform ${visible ? "translate-x-0 opacity-100 scale-100" : "translate-x-12 opacity-0 scale-90 pointer-events-none"}`}>
            <div className="glass-strong border-muse-primary/40 rounded-[2rem] p-5 flex items-center gap-5 shadow-glow-purple group">
                {/* Visualizer Circle with Pulse */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-muse-primary/20 rounded-full animate-ping opacity-60" />
                    <div className="absolute inset-0 bg-muse-primary/10 rounded-full animate-pulse blur-md" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-muse-primary to-muse-secondary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Radio className="w-5 h-5 text-white animate-pulse" />
                    </div>
                </div>
 
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-muse-primary-light animate-float" />
                        <span className="text-[10px] font-black text-muse-primary-light uppercase tracking-[0.2em]">AI-DJ Active</span>
                    </div>
                    <span className="text-base font-display font-medium text-white/90 mt-1">{message}</span>
                </div>
 
                <div className="h-10 w-[1px] bg-white/10 mx-2" />
 
                <div className="flex gap-1.5 items-end h-8">
                    {[1, 2, 3, 4].map(i => (
                        <div 
                            key={i} 
                            className="w-1.5 bg-gradient-to-t from-muse-primary to-muse-primary-light rounded-full animate-music-bar" 
                            style={{ 
                                height: `${40 + Math.random() * 60}%`, 
                                animationDelay: i * 0.15 + 's',
                                animationDuration: '0.6s'
                            }} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
