"use client";

import { motion } from 'framer-motion';
import { Sparkles, Play, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";
import { sdkStreamUrl } from "@/lib/audiusSdk";

const motivationalSnippets = [
    {
        id: "motiv-1",
        quote: "The most effective way to do it, is to do it.",
        author: "Amelia Earhart",
        audioUrl: sdkStreamUrl("D7KyD"),
        duration: 45
    },
    {
        id: "motiv-2",
        quote: "Think like a queen. A queen is not afraid to fail. Failure is another steppingstone to greatness.",
        author: "Oprah Winfrey",
        audioUrl: sdkStreamUrl("JwmzO"),
        duration: 30
    },
    {
        id: "motiv-3",
        quote: "I am not afraid of storms, for I am learning how to sail my ship.",
        author: "Louisa May Alcott",
        audioUrl: sdkStreamUrl("RM9QG"),
        duration: 60
    },
    {
        id: "motiv-4",
        quote: "You must do the things you think you cannot do.",
        author: "Eleanor Roosevelt",
        audioUrl: sdkStreamUrl("D7KyD"), // Reusing for demo
        duration: 40
    },
    {
        id: "motiv-5",
        quote: "The question isn't who is going to let me; it's who is going to stop me.",
        author: "Ayn Rand",
        audioUrl: sdkStreamUrl("JwmzO"), // Reusing for demo
        duration: 35
    }
];

export default function LiveMotivationalWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { play, currentTrack, analyserRef } = useAudioData();
    const { isPlaying } = useAudioPlayback();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % motivationalSnippets.length);
        }, 60000); // Rotate every 1 minute
        return () => clearInterval(interval);
    }, []);

    const activeSnippet = motivationalSnippets[currentIndex];
    const isPlayingCurrent = isPlaying; // React to any music playing for the animation

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass-strong rounded-[2rem] p-6 lg:p-8 border border-muse-primary/30 relative overflow-hidden group mb-8"
        >
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-muse-primary/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-muse-primary/20 transition-colors duration-1000" />
            
            {/* Nebula Canvas */}
            <canvas 
                ref={canvasRef} 
                width={300} 
                height={200} 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-full pointer-events-none opacity-40 mix-blend-screen" 
            />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                {/* Live Indicator icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muse-primary to-[#ffb800] p-[2px] shadow-glow-pink flex-shrink-0 animate-pulse-glow">
                    <div className="w-full h-full bg-muse-surface rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[#ffb800]" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ffaa] animate-pulse" />
                        <span className="text-xs font-bold tracking-widest text-[#00ffaa] uppercase">Live Motivation Broadcast</span>
                    </div>
                    
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-2"
                    >
                        <p className="text-xl lg:text-2xl font-serif text-muse-text italic leading-tight">
                            "{activeSnippet.quote}"
                        </p>
                        <p className="text-sm font-semibold text-muse-primary-light">
                            — {activeSnippet.author}
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
