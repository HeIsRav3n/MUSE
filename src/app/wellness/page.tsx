"use client";

import { motion } from 'framer-motion';
import { Heart, Activity, Wind, PlayCircle } from 'lucide-react';
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";
import { sdkStreamUrl } from "@/lib/audiusSdk";

const wellnessTracks = [
    { id: "well-1", title: "Morning Alignment", duration: "12:00", type: "Meditation", color: "from-blue-500 to-cyan-400", audioUrl: sdkStreamUrl("D7KyD") },
    { id: "well-2", title: "Deep Focus Binaurals", duration: "45:00", type: "Soundscape", color: "from-purple-500 to-indigo-400", audioUrl: sdkStreamUrl("JwmzO") },
    { id: "well-3", title: "Pre-Show Anxiety Relief", duration: "08:30", type: "Breathwork", color: "from-emerald-500 to-teal-400", audioUrl: sdkStreamUrl("RM9QG") },
    { id: "well-4", title: "Creative Flow State", duration: "30:00", type: "Frequencies", color: "from-amber-500 to-orange-400", audioUrl: sdkStreamUrl("x5P4K") },
];

export default function WellnessPage() {
    const { play, currentTrack } = useAudioData();
    const { isPlaying } = useAudioPlayback();

    const handlePlayWellness = (track: typeof wellnessTracks[0]) => {
        const parts = track.duration.split(':');
        const seconds = parts.length === 2 
            ? parseInt(parts[0]) * 60 + parseInt(parts[1]) 
            : parseInt(parts[0]) || 0;

        const qt: QueueTrack = {
            id: track.id,
            title: track.title,
            artist: `Wellness Audio • ${track.type}`,
            artwork: "https://images.unsplash.com/photo-1554200876-56c2f25224fa?w=800&q=80",
            audioUrl: track.audioUrl,
            duration: seconds
        };
        play(qt);
    };
    return (
        <div className="min-h-screen p-6 lg:p-10 relative">
            {/* Ambient Background specific to Wellness */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(255,184,200,0.05)_0%,transparent_100%)] mix-blend-screen" />
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up mt-10">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 p-[2px] mb-6 shadow-[0_0_40px_rgba(251,113,133,0.4)]">
                    <div className="w-full h-full bg-[#130626] rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
                    </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-light text-white tracking-wide mb-4">
                    Wellness <span className="font-serif italic font-medium text-rose-300">Audio</span>
                </h1>
                <p className="text-lg text-rose-200/60 font-light leading-relaxed">
                    Take a moment for yourself. Curated sound baths, breathwork, and meditation tracks designed to ground and center women creators in the fast-moving Web3 space.
                </p>
            </div>

            {/* Daily Recommend */}
            <div className="max-w-4xl mx-auto mb-16">
                <div className="glass-strong rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-10 hover:border-rose-400/30 transition-colors border-rose-900/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div 
                        onClick={() => handlePlayWellness(wellnessTracks[0])}
                        className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 animate-pulse-glow flex-shrink-0 flex items-center justify-center shadow-lg relative group cursor-pointer 
                        hover:scale-105 transition-transform"
                    >
                        <div className="absolute inset-2 bg-[#130626] rounded-full flex items-center justify-center transition-transform group-hover:scale-95">
                            <PlayCircle className={`w-16 h-16 ${currentTrack?.id === wellnessTracks[0].id && isPlaying ? 'text-white animate-pulse' : 'text-rose-400 group-hover:text-white'} transition-colors`} />
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-bold tracking-widest uppercase mb-4 border border-rose-500/20">
                            <Activity className="w-3.5 h-3.5" /> Daily Featured
                        </div>
                        <h2 className="text-3xl font-serif text-white mb-3">The Reset Sound Bath</h2>
                        <p className="text-muse-text-muted mb-6 leading-relaxed">
                            A 15-minute immersive crystal bowl session tuned to 432Hz to help you clear mental fog and reset your nervous system before your next big launch.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-mono text-rose-200/50">
                            <span className="flex items-center gap-2"><Wind className="w-4 h-4" /> 432Hz</span>
                            <span>15:00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {wellnessTracks.map((track, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        key={idx}
                        onClick={() => handlePlayWellness(track)}
                        className={`glass p-6 rounded-3xl flex items-center justify-between cursor-pointer transition-all group ${currentTrack?.id === track.id && isPlaying ? 'border border-rose-400/50 bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${track.color} opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1 group-hover:text-rose-300 transition-colors">{track.title}</h3>
                                <p className="text-xs font-mono text-muse-text-muted tracking-wider uppercase">{track.type}</p>
                            </div>
                        </div>
                        <span className="text-muse-text-dim font-mono text-sm bg-white/5 px-2 py-1 rounded">{track.duration}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
