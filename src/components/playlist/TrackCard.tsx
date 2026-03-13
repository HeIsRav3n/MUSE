"use client";

import { AudiusTrack } from "@/types/audius";
import { sdkStreamUrl } from "@/lib/audiusSdk";
import { useAudioData, type QueueTrack } from "@/lib/audioStore";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";

interface TrackCardProps {
    track: AudiusTrack;
    index: number;
}

export const TrackCard = memo(function TrackCard({ track, index }: TrackCardProps) {
    const artworkUrl = track.artwork?.["480x480"] || track.artwork?.["150x150"];
    const { play } = useAudioData();

    const handlePlay = () => {
        const id = track.id || track.track_id;
        if (!id) return;
        const trackIdStr = String(id);
        const qt: QueueTrack = {
            id: trackIdStr,
            title: track.title,
            artist: track.user.name,
            artwork: artworkUrl,
            audioUrl: sdkStreamUrl(trackIdStr),
            duration: track.duration,
        };
        play(qt);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 1), duration: 0.5 }}
            className="group relative aspect-square rounded-2xl overflow-hidden glass-hover cursor-pointer"
            onClick={handlePlay}
        >
            {/* Optimized Background Image */}
            {artworkUrl ? (
                <Image
                    src={artworkUrl}
                    alt={track.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={index < 4}
                    quality={75}
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-muse-card flex items-center justify-center">
                    <span className="text-muse-text-muted font-display text-2xl font-bold opacity-30">
                        A
                    </span>
                </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Top Left Index Badge */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-white/90">{index + 1}</span>
            </div>

            {/* Hover Play Button (Centered) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="w-16 h-16 rounded-full bg-muse-primary/90 backdrop-blur-md text-white flex items-center justify-center shadow-glow-pink">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-muse-primary-light transition-colors drop-shadow-md">
                    {track.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base mt-1 line-clamp-1 font-medium drop-shadow-md">
                    {track.user.name}
                </p>
            </div>
            
            {/* Outline Glow on Hover */}
            <div className="absolute inset-0 border-[1.5px] border-transparent group-hover:border-muse-primary/40 rounded-2xl transition-colors duration-300 pointer-events-none" />
        </motion.div>
    );
});
