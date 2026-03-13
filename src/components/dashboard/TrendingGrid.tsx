"use client";

import { motion } from 'framer-motion';
import { Play, Heart, Share2 } from 'lucide-react';
import { AudiusImage } from '@/components/ui/AudiusImage';
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";

interface TrendingGridProps {
    tracks: any[];
    title: string;
}

export function TrendingGrid({ tracks, title }: TrendingGridProps) {
    const { play } = useAudioData();
    const { isPlaying } = useAudioPlayback();

    const handlePlay = (track: any) => {
        const qt: QueueTrack = {
            id: track.id,
            title: track.title,
            artist: track.user.name,
            artwork: track.artwork || track.user?.profile_picture?.['480x480'],
            audioUrl: `https://api.audius.co/v1/tracks/${track.id}/stream?api_key=0xae4d3e296787e296b704511d724e7fac088ce029&app_name=MUSE`,
            duration: track.duration
        };
        play(qt);
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-black text-white tracking-tighter">{title}</h2>
                <div className="flex gap-2">
                    <button className="p-2 rounded-xl glass hover:bg-white/5 disabled:opacity-30">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="p-2 rounded-xl glass hover:bg-white/5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracks?.slice(0, 10).map((track, idx) => (
                    <motion.div
                        key={`${track.id}-${idx}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="glass group p-4 rounded-3xl hover:bg-white/5 hover:translate-y-[-8px] transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => handlePlay(track)}
                    >
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-muse-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-muse-primary flex items-center justify-center text-white shadow-glow-pink scale-75 group-hover:scale-100 transition-transform duration-300">
                                <Play className="w-7 h-7 ml-1 fill-current" />
                            </div>
                        </div>

                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5 relative shadow-lg">
                            <AudiusImage 
                                artwork={track.artwork || track.user?.profile_picture} 
                                size="md"
                                alt={track.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-display font-bold text-white text-base truncate pr-2">{track.title}</h3>
                            <p className="text-xs text-muse-text-muted truncate font-medium">{track.user.name}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muse-text-dim uppercase tracking-widest">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-rose-500/20 text-muse-text-dim hover:text-rose-400 transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-lg hover:bg-white/10 text-muse-text-dim hover:text-white transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
