"use client";

import { Music, Play, Heart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { sdkGetTrendingTracks, sdkStreamUrl, formatCount, formatDuration, type SdkTrack } from "@/lib/audiusSdk";
import { useAudioStore, type QueueTrack } from "@/lib/audioStore";

export function TrendingTracks() {
    const [tracks, setTracks] = useState<SdkTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { play, addToQueue, currentTrack, isPlaying } = useAudioStore();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await sdkGetTrendingTracks(8);
                setTracks(data);
            } catch (e) {
                console.error("Failed to fetch trending:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const playTrack = (t: SdkTrack) => {
        const qt: QueueTrack = {
            id: t.id,
            title: t.title,
            artist: t.user.name,
            artwork: t.artwork?.["480x480"] || t.artwork?.["150x150"],
            audioUrl: sdkStreamUrl(t.id),
            duration: t.duration,
        };
        play(qt);
    };

    const queueAll = () => {
        tracks.forEach((t) => {
            const qt: QueueTrack = {
                id: t.id,
                title: t.title,
                artist: t.user.name,
                artwork: t.artwork?.["480x480"] || t.artwork?.["150x150"],
                audioUrl: sdkStreamUrl(t.id),
                duration: t.duration,
            };
            addToQueue(qt);
        });
    };

    return (
        <div className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-sonara-secondary" />
                    <h3 className="font-display font-semibold text-sonara-text">Trending on Audius</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={queueAll}
                        className="text-[10px] text-sonara-text-muted hover:text-sonara-primary transition px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                        Queue All
                    </button>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sonara-secondary/10">
                        <Music className="w-3 h-3 text-sonara-secondary" />
                        <span className="text-[10px] text-sonara-secondary font-semibold">LIVE</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
                            <div className="w-12 h-12 rounded-lg bg-sonara-border/50 shimmer" />
                            <div className="flex-1">
                                <div className="h-3 w-32 bg-sonara-border/50 rounded shimmer mb-2" />
                                <div className="h-2 w-20 bg-sonara-border/50 rounded shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-1.5">
                    {tracks.map((track, i) => {
                        const isCurrentTrack = currentTrack?.id === track.id;
                        return (
                            <button
                                key={track.id}
                                onClick={() => playTrack(track)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer ${isCurrentTrack ? "bg-sonara-primary/10 ring-1 ring-sonara-primary/20" : ""
                                    }`}
                            >
                                <span className="text-xs font-mono text-sonara-text-muted w-5">{i + 1}</span>
                                <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gradient-to-br from-sonara-primary/30 to-sonara-secondary/20 flex-shrink-0">
                                    {track.artwork?.["150x150"] ? (
                                        <img src={track.artwork["150x150"]} alt={track.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Music className="w-5 h-5 text-sonara-primary/50" />
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrentTrack && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        }`}>
                                        <Play className={`w-4 h-4 text-white ${isCurrentTrack && isPlaying ? "animate-pulse" : ""}`} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className={`text-sm font-medium truncate ${isCurrentTrack ? "text-sonara-primary-light" : "text-sonara-text"}`}>
                                        {track.title}
                                    </p>
                                    <p className="text-xs text-sonara-text-muted truncate">{track.user?.name}</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 text-xs text-sonara-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Play className="w-3 h-3" /> {formatCount(track.playCount)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" /> {formatCount(track.favoriteCount)}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-sonara-text-muted">{formatDuration(track.duration)}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
