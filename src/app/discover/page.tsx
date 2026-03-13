"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Music2, Share2, MoreHorizontal, Search } from 'lucide-react';
import { AudiusPlaylistResponse, AudiusTrack } from '@/types/audius';
import { AudiusImage } from '@/components/ui/AudiusImage';

import { Suspense } from 'react';

function DiscoverContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('search') || '';
    
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState<AudiusTrack[]>([]);
    const [displayQuery, setDisplayQuery] = useState(query);

    // Fetch Audius results
    const fetchSearchResults = useCallback(async (currentQuery: string) => {
        setLoading(true);
        try {
            const playlistFetch = await fetch('https://api.audius.co/v1/playlists/dp2Vo4m', {
                next: { revalidate: 3600 } // Enable Next.js fetch caching
            });
            if (!playlistFetch.ok) throw new Error('API Sync Failed');
            
            const data: AudiusPlaylistResponse = await playlistFetch.json();
            
            let filtered = data.data[0].tracks;
            if (currentQuery.trim()) {
                const lcQuery = currentQuery.toLowerCase();
                filtered = filtered.filter(t => 
                    t.title.toLowerCase().includes(lcQuery) || 
                    t.user.name.toLowerCase().includes(lcQuery)
                );
            }
            
            setTracks(filtered);
            setDisplayQuery(currentQuery);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Debounce search effect
        const handler = setTimeout(() => {
            fetchSearchResults(query);
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [query, fetchSearchResults]);

    return (
        <div className="min-h-screen p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-10 text-center animate-slide-up">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-muse-primary/20 to-muse-secondary/20 border border-white/5 mb-6 shadow-glow-pink">
                    <Search className="w-8 h-8 text-muse-primary-light" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-display font-black text-white drop-shadow-xl mb-4 tracking-tighter">
                    Discover <span className="gradient-text font-cursive italic">Results</span>
                </h1>
                {displayQuery ? (
                    <p className="text-lg text-muse-text-muted">
                        Showing results for <span className="text-white font-bold">"{displayQuery}"</span>
                    </p>
                ) : (
                    <p className="text-lg text-muse-text-muted">
                        Browse the trending MUSE collection.
                    </p>
                )}
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="loading"
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-muse-primary/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-muse-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-2 border-muse-secondary/20 rounded-full"></div>
                            <div className="absolute inset-4 border-2 border-b-muse-secondary rounded-full animate-spin-slow"></div>
                        </div>
                        <p className="mt-8 text-muse-text-muted text-xs tracking-[0.3em] font-bold uppercase animate-pulse">
                            Optimizing Sound Protocol...
                        </p>
                    </motion.div>
                ) : tracks.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="empty"
                        className="glass-strong rounded-[3rem] p-16 text-center max-w-2xl mx-auto mt-10 border border-white/5"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Music2 className="w-10 h-10 text-muse-text-dim opacity-40" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-3">Silent Echoes</h2>
                        <p className="text-muse-text-muted leading-relaxed">We couldn't find any creators matching "{displayQuery}". Maybe try a broader search or explore the trending section?</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="results"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {tracks.map((track, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.03 }}
                                key={`${track.id}-${idx}`}
                                className="glass rounded-[2rem] p-4 flex gap-5 hover:border-muse-primary/40 hover:bg-white/5 hover:translate-y-[-4px] transition-all group overflow-hidden relative cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-muse-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="w-28 h-28 rounded-2xl overflow-hidden relative flex-shrink-0 border border-white/10 shadow-lg">
                                    <AudiusImage 
                                        artwork={track.artwork} 
                                        size="md"
                                        alt={track.title}
                                        className="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-muse-primary flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300 shadow-glow-pink">
                                            <Play className="w-6 h-6 ml-1 fill-current" />
                                        </div>
                                    </div>
                                </div>
    
                                <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                                    <h3 className="text-xl font-display font-bold text-white truncate mb-1 group-hover:text-muse-primary-light transition-colors">{track.title}</h3>
                                    <p className="text-sm text-muse-text-dim truncate font-medium">{track.user.name}</p>
                                    
                                    <div className="flex items-center gap-5 mt-4">
                                        <div className="flex items-center gap-1.5 text-[10px] text-muse-text-muted font-bold tracking-widest uppercase">
                                            <Play className="w-3.5 h-3.5 text-muse-secondary" />
                                            <span>{track.play_count.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muse-text-muted font-bold tracking-widest uppercase">
                                            <Heart className="w-3.5 h-3.5 text-muse-primary" />
                                            <span>{track.repost_count.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col justify-between items-end relative z-10 p-1">
                                    <button className="p-2.5 rounded-2xl hover:bg-white/10 text-muse-text-muted hover:text-white transition group-hover:rotate-0 rotate-90 duration-300">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-2xl hover:bg-white/10 text-muse-text-muted hover:text-muse-primary-light transition">
                                        <Share2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DiscoverSearch() {
    return (
        <Suspense fallback={
            <div className="min-h-screen p-6 lg:p-10 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-muse-primary/10 border-t-muse-primary rounded-full animate-spin"></div>
            </div>
        }>
            <DiscoverContent />
        </Suspense>
    );
}
