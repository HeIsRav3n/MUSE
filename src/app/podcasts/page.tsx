"use client";

import { motion } from 'framer-motion';
import { Mic2, Headphones, TrendingUp, Sparkles, PlayCircle, Clock } from 'lucide-react';
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";
import { sdkStreamUrl } from "@/lib/audiusSdk";

const mockPodcasts = [
    { id: "pod-1", title: "Defying the Algorithm", creator: "Sarah Jenkins", views: "145K", length: "42 min", tag: "Tech", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80", audioUrl: sdkStreamUrl("D7KyD") },
    { id: "pod-2", title: "Web3 Engineering for Artists", creator: "Dr. Alanna Ross", views: "89K", length: "1h 12m", tag: "Engineering", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80", audioUrl: sdkStreamUrl("JwmzO") },
    { id: "pod-3", title: "Building Independent Agencies", creator: "The Founder's Circle", views: "201K", length: "55 min", tag: "Business", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80", audioUrl: sdkStreamUrl("RM9QG") },
    { id: "pod-4", title: "Mental Health in Touring", creator: "Vibe Radio", views: "45K", length: "38 min", tag: "Wellness", image: "https://images.unsplash.com/photo-1554200876-56c2f25224fa?w=800&q=80", audioUrl: sdkStreamUrl("x5P4K") },
    { id: "pod-5", title: "Smart Contract Royalties 101", creator: "CryptoWomen", views: "312K", length: "22 min", tag: "Education", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", audioUrl: sdkStreamUrl("1j4KX") },
    { id: "pod-6", title: "Vocal Producing Masterclass", creator: "Grammy Winner", views: "880K", length: "2h 5m", tag: "Production", image: "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=800&q=80", audioUrl: sdkStreamUrl("kGLqP") }
];

export default function PodcastsPage() {
    const { play, currentTrack } = useAudioData();
    const { isPlaying } = useAudioPlayback();

    const handlePlayPodcast = (pod: typeof mockPodcasts[0]) => {
        const qt: QueueTrack = {
            id: pod.id,
            title: pod.title,
            artist: pod.creator,
            artwork: pod.image,
            audioUrl: pod.audioUrl,
            duration: parseInt(pod.length) * 60 || 1800 // Fallback estimate
        };
        play(qt);
    };
    return (
        <div className="min-h-screen p-6 lg:p-10">
            {/* Header Hero */}
            <div className="relative glass-strong rounded-3xl overflow-hidden mb-12 p-10 flex flex-col justify-center min-h-[300px]">
                {/* Background glow */}
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-muse-primary/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute left-0 bottom-0 w-[300px] h-[300px] bg-muse-secondary/30 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e024c3] to-[#ffb800] flex items-center justify-center mb-6 shadow-glow-pink">
                        <Mic2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-white drop-shadow-lg mb-4 leading-tight">
                        Her Story <span className="gradient-text font-cursive">Podcasts</span>
                    </h1>
                    <p className="text-lg text-muse-text-dim max-w-xl">
                        Dive deep into the journeys of influential women in Web3, music production, funding, and decentralized technologies. Learn from the best.
                    </p>
                    
                    <button 
                        onClick={() => handlePlayPodcast(mockPodcasts[0])}
                        className="mt-8 flex items-center gap-2 btn-primary hover:scale-105 active:scale-95 transition-all w-fit"
                    >
                        <PlayCircle className="w-5 h-5" />
                        <span>Play Latest Episode</span>
                    </button>
                </div>
            </div>

            {/* Featured Section */}
            <div className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-muse-accent" /> Trending Episodes
                </h2>
                <button className="text-sm font-semibold text-muse-text-muted hover:text-white transition">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockPodcasts.map((pod, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        key={idx} 
                        className="group flex flex-col cursor-pointer"
                        onClick={() => handlePlayPodcast(pod)}
                    >
                        <div className={`w-full aspect-video rounded-3xl overflow-hidden relative mb-4 shadow-lg border transition-colors ${currentTrack?.id === pod.id && isPlaying ? 'border-muse-primary' : 'border-white/10 group-hover:border-muse-primary/50'}`}>
                            <img src={pod.image} alt={pod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0314]/90 via-transparent to-transparent" />
                            
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 backdrop-filter backdrop-blur-xl">
                                <Sparkles className="w-3.5 h-3.5 text-muse-primary-light" />
                                <span className="text-xs font-bold tracking-widest uppercase text-white">{pod.tag}</span>
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none border border-white/20">
                                    <PlayCircle className="w-8 h-8 text-white ml-1" />
                                </div>
                            </div>
                            
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-mono font-medium text-white flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {pod.length}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-muse-primary-light transition-colors line-clamp-1">{pod.title}</h3>
                        <div className="flex items-center justify-between mt-auto">
                            <p className="text-muse-text-muted text-sm">{pod.creator}</p>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-muse-text-dim bg-white/5 py-1 px-2 rounded-md">
                                <Headphones className="w-3.5 h-3.5" />
                                <span>{pod.views} listeners</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
