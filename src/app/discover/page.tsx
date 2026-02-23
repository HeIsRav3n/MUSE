"use client";

import { useState, useEffect } from "react";
import {
    Compass, Search, TrendingUp,
    Music, Users, Zap, Award, X, Play, Plus
} from "lucide-react";
import { mockScouts } from "@/lib/mockData";
import { sdkSearchUsers, sdkGetTrendingTracks, sdkStreamUrl, type SdkUser, type SdkTrack } from "@/lib/audiusSdk";
import { useAudioStore, type QueueTrack } from "@/lib/audioStore";

type AudiusUser = SdkUser;

const genres = ["All", "Electronic", "Hip Hop", "Pop", "R&B", "Lo-Fi", "Rock", "Indie"];
const badgeColors: Record<string, string> = {
    Diamond: "from-purple-400 to-cyan-400",
    Gold: "from-yellow-400 to-orange-400",
    Silver: "from-gray-300 to-gray-500",
    Bronze: "from-orange-600 to-orange-800",
};

export default function DiscoverPage() {
    const { play, addToQueue } = useAudioStore();
    const [query, setQuery] = useState("");
    const [artists, setArtists] = useState<AudiusUser[]>([]);
    const [trendingTracks, setTrendingTracks] = useState<SdkTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [showStakeModal, setShowStakeModal] = useState<string | null>(null);
    const [stakeAmount, setStakeAmount] = useState("1000");

    const searchArtists = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const data = await sdkSearchUsers(q, 12);
            setArtists(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async () => {
        try {
            const data = await sdkGetTrendingTracks(8, selectedGenre);
            setTrendingTracks(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        searchArtists("electronic");
        fetchTrending();
    }, []);

    useEffect(() => {
        fetchTrending();
    }, [selectedGenre]);

    const handlePlayTrack = (track: SdkTrack) => {
        const qt: QueueTrack = {
            id: track.id,
            title: track.title,
            artist: track.user.name,
            artwork: track.artwork?.["480x480"] || track.artwork?.["150x150"] || track.user.profilePicture?.["150x150"] || "",
            audioUrl: sdkStreamUrl(track.id),
            duration: track.duration,
        };
        play(qt);
    };

    return (
        <div className="space-y-8 animate-slide-up pb-20">
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                    Explore & Discover
                </h1>
                <p className="text-sm text-sonara-text-muted mt-1">
                    Live trends from Audius, emerging talent, and scout rewards
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sonara-text-muted" />
                    <input
                        type="text"
                        placeholder="Search artists on Audius..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchArtists(query)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sm text-sonara-text placeholder:text-sonara-text-muted focus:outline-none focus:border-sonara-primary/50 transition-all"
                    />
                </div>
                <button onClick={() => searchArtists(query)} className="btn-primary px-6">
                    <Search className="w-4 h-4" /> Search
                </button>
            </div>

            {/* Genre filters */}
            <div className="flex gap-2 flex-wrap">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedGenre === genre
                            ? "bg-sonara-primary text-white"
                            : "bg-white/5 text-sonara-text-dim hover:bg-white/10 border border-sonara-border/50"
                            }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* Trending Tracks Section */}
            <div>
                <h3 className="text-sm font-semibold text-sonara-text-dim mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Live ({selectedGenre})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trendingTracks.map((track) => (
                        <div key={track.id} className="group glass rounded-xl overflow-hidden hover:bg-white/5 transition-all">
                            <div className="relative aspect-square">
                                <img
                                    src={track.artwork?.["480x480"] || track.user.profilePicture?.["480x480"] || "/placeholder.png"}
                                    alt={track.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePlayTrack(track)}
                                        className="w-10 h-10 rounded-full bg-sonara-primary flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-purple-500/20"
                                    >
                                        <Play className="w-5 h-5 fill-current ml-0.5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10px] items-center gap-1 text-white hidden group-hover:flex">
                                    <Music className="w-3 h-3" /> {track.playCount > 1000 ? (track.playCount / 1000).toFixed(1) + 'k' : track.playCount}
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-semibold text-sonara-text truncate" title={track.title}>{track.title}</h4>
                                <p className="text-xs text-sonara-text-muted truncate">{track.user.name}</p>
                            </div>
                        </div>
                    ))}
                    {trendingTracks.length === 0 && (
                        <div className="col-span-full py-10 text-center text-sonara-text-dim">
                            Loading trending tracks...
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Artists Grid */}
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-semibold text-sonara-text-dim mb-3 flex items-center gap-2">
                        <Compass className="w-4 h-4" /> Discovered Artists
                    </h3>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="glass rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-14 h-14 rounded-xl bg-sonara-border/50 shimmer" />
                                        <div className="flex-1">
                                            <div className="h-4 w-24 bg-sonara-border/50 rounded shimmer mb-2" />
                                            <div className="h-3 w-16 bg-sonara-border/50 rounded shimmer" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {artists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="glass rounded-xl p-4 glass-hover cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-sonara-primary/30 to-sonara-secondary/20 flex-shrink-0">
                                            {artist.profilePicture?.["150x150"] ? (
                                                <img src={artist.profilePicture["150x150"]} alt={artist.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl font-bold gradient-text">
                                                    {artist.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-semibold text-sonara-text truncate">{artist.name}</p>
                                                {artist.isVerified && <Zap className="w-3.5 h-3.5 text-sonara-secondary flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs text-sonara-text-muted">@{artist.handle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-3 text-xs text-sonara-text-muted">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {artist.followerCount?.toLocaleString() || 0}</span>
                                        <span className="flex items-center gap-1"><Music className="w-3 h-3" /> {artist.trackCount} tracks</span>
                                    </div>
                                    {/* Simulated growth metrics */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-sonara-success" />
                                            <span className="text-xs text-sonara-success font-mono">
                                                +{(Math.random() * 200 + 50).toFixed(0)}%
                                            </span>
                                            <span className="text-[10px] text-sonara-text-muted">30d</span>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sonara-primary/10 text-sonara-primary-light border border-sonara-primary/20">
                                            Score: {(70 + Math.random() * 25).toFixed(0)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowStakeModal(artist.id)}
                                        className="w-full btn-secondary text-xs py-2 justify-center"
                                    >
                                        <Zap className="w-3.5 h-3.5" /> Stake on Artist
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Scout Leaderboard */}
                <div>
                    <h3 className="text-sm font-semibold text-sonara-text-dim mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Scout Leaderboard
                    </h3>
                    <div className="glass rounded-2xl p-4 space-y-2">
                        {mockScouts.map((scout) => (
                            <div
                                key={scout.rank}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all"
                            >
                                <span className={`text-lg font-bold font-mono w-7 ${scout.rank <= 3 ? "gradient-text" : "text-sonara-text-muted"}`}>
                                    #{scout.rank}
                                </span>
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${badgeColors[scout.badge]} flex items-center justify-center text-white text-[10px] font-bold`}>
                                    {scout.handle[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-sonara-text truncate">{scout.handle}</p>
                                    <p className="text-[10px] text-sonara-text-muted">
                                        {scout.discoveries} discoveries · {scout.accuracy}% accuracy
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-mono text-sonara-success">${(scout.totalEarned / 1000).toFixed(0)}K</p>
                                    <p className="text-[10px] text-sonara-text-muted">{scout.badge}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stake Modal */}
            {showStakeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-strong rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-display font-bold gradient-text">Stake on Artist</h3>
                            <button onClick={() => setShowStakeModal(null)} className="p-1 rounded-lg hover:bg-white/5">
                                <X className="w-5 h-5 text-sonara-text-muted" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1 block">Stake Amount ($SOUND)</label>
                                <input
                                    type="number"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-sonara-surface border border-sonara-border text-sonara-text focus:outline-none focus:border-sonara-primary/50"
                                />
                            </div>
                            <div className="glass rounded-xl p-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Discovery NFT</span>
                                    <span className="text-sonara-text">Will be minted</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Early Scout Bonus</span>
                                    <span className="text-sonara-success">+5% revenue share</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-sonara-text-muted">Lock Period</span>
                                    <span className="text-sonara-text">30 days</span>
                                </div>
                            </div>
                            <button className="w-full btn-primary py-3 justify-center text-base">
                                <Zap className="w-5 h-5" /> Confirm Stake
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
