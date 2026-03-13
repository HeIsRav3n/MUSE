"use client";

import { useState } from "react";
import {
    Users,
    UserPlus,
    Search,
    MessageCircle,
    Music,
    Check,
    X,
    Share2,
    Copy,
} from "lucide-react";

interface Friend {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    status: "online" | "listening" | "offline";
    currentTrack?: string;
    mutualFriends: number;
}

interface FriendRequest {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    message: string;
    time: string;
}

const mockFriends: Friend[] = [
    { id: "1", name: "WaveRider", handle: "@waverider", avatar: "🏄", status: "listening", currentTrack: "Night Visions — Eclipse", mutualFriends: 8 },
    { id: "2", name: "BeatHunter", handle: "@beathunter", avatar: "🎯", status: "online", mutualFriends: 12 },
    { id: "3", name: "SynthQueen", handle: "@synthqueen", avatar: "👑", status: "listening", currentTrack: "Deep Dive — CyberOrbit", mutualFriends: 5 },
    { id: "4", name: "BassDrop", handle: "@bassdrop", avatar: "🔊", status: "offline", mutualFriends: 3 },
    { id: "5", name: "MelodyMind", handle: "@melodymind", avatar: "🧠", status: "online", mutualFriends: 15 },
    { id: "6", name: "VinylVault", handle: "@vinylvault", avatar: "📀", status: "offline", mutualFriends: 7 },
    { id: "7", name: "NeonNotes", handle: "@neonnotes", avatar: "✨", status: "listening", currentTrack: "Aurora — StarField", mutualFriends: 4 },
    { id: "8", name: "AlphaHunter", handle: "@alphahunter", avatar: "🐺", status: "online", mutualFriends: 20 },
];

const mockRequests: FriendRequest[] = [
    { id: "r1", name: "CryptoBeats", handle: "@cryptobeats", avatar: "🎹", message: "Hey! Love your taste in music", time: "2h ago" },
    { id: "r2", name: "SonicBoom", handle: "@sonicboom", avatar: "💥", message: "Found you through Scanner", time: "1d ago" },
];

const statusColors = {
    online: "bg-green-500",
    listening: "bg-muse-primary animate-pulse",
    offline: "bg-gray-500",
};

export default function FriendsPage() {
    const [tab, setTab] = useState<"list" | "requests" | "search" | "share">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [friends] = useState(mockFriends);
    const [requests, setRequests] = useState(mockRequests);
    const [copied, setCopied] = useState(false);

    const filteredFriends = searchQuery
        ? friends.filter((f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.handle.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : friends;

    const acceptRequest = (id: string) => setRequests((r) => r.filter((req) => req.id !== id));
    const declineRequest = (id: string) => setRequests((r) => r.filter((req) => req.id !== id));

    const copyLink = () => {
        navigator.clipboard.writeText("https://muse.xyz/invite/rav3n");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">Friends</h1>
                    <p className="text-sm text-muse-text-muted mt-1">
                        {friends.filter((f) => f.status !== "offline").length} online •{" "}
                        {friends.filter((f) => f.status === "listening").length} listening now
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setTab("search")} className="p-2.5 rounded-xl glass hover:bg-white/5 transition">
                        <Search className="w-5 h-5 text-muse-text-dim" />
                    </button>
                    <button onClick={() => setTab("share")} className="p-2.5 rounded-xl glass hover:bg-white/5 transition">
                        <Share2 className="w-5 h-5 text-muse-text-dim" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-muse-border/50 pb-px">
                {[
                    { key: "list" as const, label: "Friends", icon: Users, count: friends.length },
                    { key: "requests" as const, label: "Requests", icon: UserPlus, count: requests.length },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${tab === t.key
                                ? "border-muse-primary text-muse-primary"
                                : "border-transparent text-muse-text-muted hover:text-muse-text"
                            }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                        {t.count > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-muse-primary/20 text-muse-primary" : "bg-muse-border text-muse-text-muted"
                                }`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="glass rounded-2xl p-5">
                {/* Search */}
                {tab === "search" && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Audius username or wallet address..."
                            autoFocus
                            className="w-full bg-muse-surface border border-muse-border rounded-xl px-4 py-3 text-sm text-muse-text placeholder:text-muse-text-muted focus:outline-none focus:border-muse-primary/50 transition-all"
                        />
                        <div className="space-y-2">
                            {filteredFriends.map((f) => (
                                <FriendCard key={f.id} friend={f} />
                            ))}
                            {filteredFriends.length === 0 && (
                                <p className="text-center text-muse-text-muted py-8 text-sm">No results found</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Share / Invite */}
                {tab === "share" && (
                    <div className="flex flex-col items-center py-8 gap-4">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-muse-primary/30 to-muse-accent/30 flex items-center justify-center text-5xl">
                            🔗
                        </div>
                        <h3 className="text-lg font-semibold text-muse-text">Share Your Profile</h3>
                        <p className="text-sm text-muse-text-muted text-center max-w-xs">
                            Invite friends to join MUSE and discover music together
                        </p>
                        <div className="flex items-center gap-2 w-full max-w-sm">
                            <div className="flex-1 glass rounded-xl px-4 py-2.5 text-sm font-mono text-muse-text-dim truncate">
                                muse.xyz/invite/rav3n
                            </div>
                            <button
                                onClick={copyLink}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? "bg-muse-success/20 text-muse-success" : "btn-primary"
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Friends List */}
                {tab === "list" && (
                    <div className="space-y-2">
                        {friends.map((f) => (
                            <FriendCard key={f.id} friend={f} />
                        ))}
                    </div>
                )}

                {/* Requests */}
                {tab === "requests" && (
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <p className="text-center text-muse-text-muted py-8 text-sm">No pending requests</p>
                        ) : (
                            requests.map((r) => (
                                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muse-primary/30 to-muse-secondary/30 flex items-center justify-center text-lg flex-shrink-0">
                                            {r.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muse-text">{r.name}</p>
                                            <p className="text-[10px] text-muse-text-muted">{r.message} • {r.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptRequest(r.id)}
                                            className="p-2 rounded-lg bg-muse-success/20 hover:bg-muse-success/30 text-muse-success transition"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => declineRequest(r.id)}
                                            className="p-2 rounded-lg bg-muse-danger/20 hover:bg-muse-danger/30 text-muse-danger transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function FriendCard({ friend }: { friend: Friend }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muse-primary/30 to-muse-secondary/30 flex items-center justify-center text-lg flex-shrink-0">
                        {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-muse-card ${statusColors[friend.status]}`} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-muse-text">{friend.name}</p>
                    {friend.status === "listening" && friend.currentTrack ? (
                        <p className="text-[10px] text-muse-primary flex items-center gap-1 truncate">
                            <Music className="w-3 h-3 flex-shrink-0" /> {friend.currentTrack}
                        </p>
                    ) : (
                        <p className="text-[10px] text-muse-text-muted">{friend.handle} • {friend.mutualFriends} mutual</p>
                    )}
                </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-2 rounded-lg hover:bg-white/10 transition">
                    <MessageCircle className="w-4 h-4 text-muse-text-dim" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 transition">
                    <Music className="w-4 h-4 text-muse-text-dim" />
                </button>
            </div>
        </div>
    );
}
