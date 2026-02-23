"use client";

import { useAudioStore } from "@/lib/audioStore";
import { Sparkles, Zap, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export function AIDJOverlay() {
    const { aiDjMode, currentTrack, isPlaying } = useAudioStore();
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
        <div className={`fixed top-24 right-6 z-40 transition-all duration-500 transform ${visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"}`}>
            <div className="bg-black/60 backdrop-blur-md border border-sonara-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                {/* Visualizer Circle */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-sonara-primary/20 rounded-full animate-ping" />
                    <div className="relative w-8 h-8 bg-gradient-to-br from-sonara-primary to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg">
                        <Radio className="w-4 h-4 text-white animate-pulse" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-sonara-primary-light" />
                        <span className="text-xs font-bold text-sonara-primary-light uppercase tracking-wider">AI-DJ Active</span>
                    </div>
                    <span className="text-sm font-medium text-white">{message}</span>
                </div>

                <div className="h-8 w-[1px] bg-white/10 mx-1" />

                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 bg-sonara-primary/50 rounded-full animate-music-bar" style={{ height: 12 + Math.random() * 12 + 'px', animationDelay: i * 0.1 + 's' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
