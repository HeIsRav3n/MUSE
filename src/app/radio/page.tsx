"use client";

import { useState } from "react";
import { Radio, Heart, Users, Play, ExternalLink, Zap } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { useAudioStore } from "@/lib/audioStore";
import { sdkGetTrendingTracks, sdkStreamUrl } from "@/lib/audiusSdk";
import { getZenoStations } from "@/lib/zenoSdk";

// Mock Radio Stations
const stations = [
    {
        id: "lofi-beats",
        name: "Lofi Study Beats",
        genre: "Chill / Lofi",
        listeners: 1243,
        currentTrack: "Late Night Coding - Chillhop",
        cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=300&h=300",
        tips: "2.4K $SOUND",
        color: "from-purple-500 to-indigo-600",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: "cyber-punk",
        name: "Cyberpunk City",
        genre: "Synthwave / Dark",
        listeners: 892,
        currentTrack: "Neon Rain - SynthAisle",
        cover: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300&h=300",
        tips: "1.8K $SOUND",
        color: "from-cyan-500 to-blue-600",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: "crypto-talk",
        name: "Web3 Talks 24/7",
        genre: "Podcast / News",
        listeners: 450,
        currentTrack: "Bitcoin Halving Analysis",
        cover: "https://images.unsplash.com/photo-1621504450168-38f647319936?auto=format&fit=crop&q=80&w=300&h=300",
        tips: "5.1K $SOUND",
        color: "from-amber-500 to-orange-600",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: "deep-house",
        name: "Deep House Dive",
        genre: "House / Electronic",
        listeners: 2100,
        currentTrack: "Ocean Drive - Duke",
        cover: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=300&h=300",
        tips: "8.9K $SOUND",
        color: "from-fuchsia-500 to-pink-600",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
];

export default function RadioPage() {
    const { play, setRadioStation, radioStation, addToQueue, clearQueue, setIsLoading, isLoading } = useAudioStore();
    const [tipping, setTipping] = useState<string | null>(null);

    const handlePlay = async (station: typeof stations[0]) => {
        setRadioStation(station.name);
        setIsLoading(true);
        clearQueue();

        try {
            // 1. Determine search tag based on station genre
            const getSearchTag = (id: string) => {
                if (id === "lofi-beats") return "lofi";
                if (id === "cyber-punk") return "synthwave";
                if (id === "deep-house") return "house";
                if (id === "crypto-talk") return "crypto";
                return "chill";
            };

            const tag = getSearchTag(station.id);
            console.log(`Fetching live stations for tag: ${tag}`);

            // 2. Fetch from Zeno/RadioBrowser
            // We verify the import dynamically or assume it's imported at top
            let liveStations = await getZenoStations({ limit: 20, tag });

            // Fallback if no specific tag results
            if (!liveStations || liveStations.length === 0) {
                console.warn("No stations found for tag, fetching top Zeno stations...");
                liveStations = await getZenoStations({ limit: 20 }); // General 'zeno' search
            }

            if (liveStations && liveStations.length > 0) {
                // Map to QueueTrack
                // For live radio, artist = station name, title = "Live Radio" (or dynamic if available)
                const queueTracks = liveStations.map(st => ({
                    id: st.id,
                    title: st.name, // Title is the station name
                    artist: "Live Radio",
                    artwork: st.favicon || station.cover, // Fallback to category cover
                    audioUrl: st.url,
                    duration: 0 // Live stream
                }));

                play(queueTracks[0]);
                queueTracks.slice(1).forEach(t => addToQueue(t));
            } else {
                throw new Error("No live stations found.");
            }

        } catch (e) {
            console.error("Failed to fetch radio stations:", e);
            // Fallback to mock
            play({
                id: station.id,
                title: station.currentTrack,
                artist: station.name,
                artwork: station.cover,
                duration: 0,
                audioUrl: station.audioUrl
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTip = (id: string) => {
        setTipping(id);
        setTimeout(() => {
            setTipping(null);
            alert(`Tipped 50 $SOUND to this station! Request sent! 🚀`);
        }, 1500);
    };

    return (
        <div className="p-6 pb-32 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-display text-white">Live Radio Stations</h1>
                <p className="text-sonara-text-muted">Tune in to community-curated stations. Tip to request tracks.</p>
            </div>

            {/* Featured Station */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-black border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Live Now
                    </span>
                </div>

                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex-shrink-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stations[0].cover} alt="Station" className="w-full h-full object-cover rounded-full" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{stations[0].name}</h2>
                        <p className="text-lg text-white/70 flex items-center justify-center md:justify-start gap-2">
                            <Radio className="w-5 h-5" />
                            Playing: {stations[0].currentTrack}
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-medium text-sonara-text-muted">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {stations[0].listeners.toLocaleString()} listening
                        </div>
                        <div className="flex items-center gap-2 text-sonara-primary-light">
                            <Heart className="w-4 h-4" />
                            {stations[0].tips} tipped
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2 justify-center md:justify-start">
                        <button
                            onClick={() => handlePlay(stations[0])}
                            className="px-8 py-3 rounded-xl bg-sonara-primary text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Tune In
                        </button>
                        <button
                            onClick={() => handleTip(stations[0].id)}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center gap-2"
                        >
                            <Zap className="w-5 h-5 text-yellow-400" />
                            {tipping === stations[0].id ? "Sending..." : "Tip to Request"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Station Grid */}
            <Section title="All Stations" icon={Radio}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {stations.slice(1).map((station) => (
                        <div key={station.id} className="group relative bg-sonara-card/50 hover:bg-sonara-card border border-white/5 hover:border-sonara-border/50 rounded-2xl p-4 transition-all hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${station.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Radio className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-mono text-sonara-success bg-sonara-success/10 px-2 py-1 rounded-lg">
                                    {station.listeners} listeners
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{station.name}</h3>
                            <p className="text-xs text-sonara-text-muted mb-3">{station.genre}</p>

                            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-black/20">
                                <div className="w-1 h-4 bg-sonara-primary/50 rounded-full animate-music-bar" />
                                <div className="w-1 h-6 bg-sonara-primary/80 rounded-full animate-music-bar [animation-delay:0.1s]" />
                                <div className="w-1 h-3 bg-sonara-primary/50 rounded-full animate-music-bar [animation-delay:0.2s]" />
                                <span className="text-xs text-sonara-text-dim truncate">{station.currentTrack}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePlay(station)}
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-sonara-primary hover:text-white transition-colors text-xs font-medium text-sonara-text"
                                >
                                    Play
                                </button>
                                <button
                                    onClick={() => handleTip(station.id)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors text-sonara-text-muted"
                                    title="Tip Station"
                                >
                                    <Zap className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
