"use client";

import { useState, useEffect, useRef } from "react";
import {
    User, Bell, Palette, Link2, Save, Moon, Sun, Sparkles, Monitor,
    Shield, Eye, EyeOff, Volume2, Music2, Zap, Globe, Trash2,
    ChevronRight, Check, HelpCircle, Download, Lock, Headphones,
    Camera, AlertTriangle, X,
} from "lucide-react";
import { useAudiusAuth } from "@/context/AudiusAuthContext";
import { useSession, signIn, signOut } from "next-auth/react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { Section } from "@/components/ui/Section";

/* ─── Types ─── */
type Theme = "dark" | "light" | "neon" | "system";
type Tab = "profile" | "appearance" | "audio" | "notifications" | "privacy" | "connections" | "about";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "appearance", label: "Appearance", icon: Palette },
    { key: "audio", label: "Audio & Playback", icon: Headphones },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "privacy", label: "Privacy & Security", icon: Shield },
    { key: "connections", label: "Connections", icon: Link2 },
    { key: "about", label: "About", icon: HelpCircle },
];

/* ─── Toggle component ─── */
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
            onClick={() => onChange(!on)}
            className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${on ? "bg-sonara-primary shadow-[0_0_12px_rgba(168,85,247,0.35)]" : "bg-sonara-border hover:bg-sonara-border/80"
                }`}
            aria-label={label}
            role="switch"
            aria-checked={on}
        >
            <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${on ? "left-[22px]" : "left-0.5"
                    }`}
            />
        </button>
    );
}

/* ─── Settings Row ─── */
function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-3.5 px-4 hover:bg-white/[0.02] rounded-xl transition-colors group">
            <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-sonara-text">{label}</p>
                {description && <p className="text-xs text-sonara-text-muted mt-0.5">{description}</p>}
            </div>
            {children}
        </div>
    );
}

/* ─── Delete Confirmation Modal ─── */
function DeleteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [confirmText, setConfirmText] = useState("");

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-bold text-sonara-text">Delete Account</h3>
                    </div>
                    <button onClick={onClose} className="text-sonara-text-muted hover:text-sonara-text transition p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-sonara-text-muted">
                    This action is <span className="text-red-400 font-semibold">permanent and irreversible</span>. All your data, staking positions, portfolio, and listening history will be permanently deleted.
                </p>
                <div>
                    <label className="text-xs text-sonara-text-muted mb-1.5 block">Type <span className="font-mono text-red-400">DELETE</span> to confirm</label>
                    <input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="w-full bg-sonara-surface border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-sonara-text focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition font-mono"
                    />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-sonara-text-muted hover:bg-white/5 transition">
                        Cancel
                    </button>
                    <button
                        disabled={confirmText !== "DELETE"}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => { alert("Account deletion would be processed here."); onClose(); }}
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════ MAIN ═══════ */
export default function SettingsPage() {
    const { user, isLoggedIn } = useAudiusAuth();
    const { data: session } = useSession();
    // const { connected, disconnect } = useWallet();
    // const { setVisible } = useWalletModal();
    const connected = false; // Mock
    const disconnect = () => { }; // Mock
    const setVisible = (v: boolean) => { alert("Solana wallet support is currently disabled due to dependency issues."); }; // Mock

    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [saved, setSaved] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    /* ─ Profile ─ */
    const [displayName, setDisplayName] = useState(user?.name || "Rav3n");
    const [bio, setBio] = useState("Music alpha hunter • Web3 builder");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Load profile from LocalStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem("sonara_user_profile");
        if (savedProfile) {
            try {
                const { displayName: savedName, bio: savedBio, avatar } = JSON.parse(savedProfile);
                if (savedName) setDisplayName(savedName);
                if (savedBio) setBio(savedBio);
                if (avatar) setAvatarPreview(avatar);
            } catch (e) {
                console.error("Failed to parse saved profile", e);
            }
        }
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) { // Reduced to 2MB for LocalStorage safety
                alert("Image too large. Please choose a file under 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatarPreview(base64);
            };
            reader.readAsDataURL(file);
        } catch {
            console.error("Failed to load image");
        }
        // Reset input so the same file can be re-selected
        e.target.value = "";
    };

    /* ─ Theme ─ */
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const saved = localStorage.getItem("sonara_theme") as Theme | null;
        if (saved) setTheme(saved);
    }, []);

    /* ─ Audio ─ */
    const [crossfade, setCrossfade] = useState(false);
    const [crossfadeMs, setCrossfadeMs] = useState(3);
    const [autoplay, setAutoplay] = useState(true);
    const [normalizeVolume, setNormalizeVolume] = useState(false);
    const [audioQuality, setAudioQuality] = useState<"low" | "normal" | "high">("normal");

    /* ─ Appearance ─ */
    const [compactMode, setCompactMode] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [waveform, setWaveform] = useState(true);

    /* ─ Notifications ─ */
    const [notifBreakout, setNotifBreakout] = useState(true);
    const [notifRewards, setNotifRewards] = useState(true);
    const [notifFriends, setNotifFriends] = useState(true);
    const [notifBonds, setNotifBonds] = useState(false);
    const [notifBrowser, setNotifBrowser] = useState(false);
    const [notifEmail, setNotifEmail] = useState(false);

    /* ─ Privacy ─ */
    const [showListening, setShowListening] = useState(true);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);
    const [analyticsOptIn, setAnalyticsOptIn] = useState(true);

    /* ─── Theme Logic ─── */
    const applyTheme = (t: Theme) => {
        setTheme(t);
        const root = document.documentElement;
        root.classList.remove("theme-light", "theme-dark", "theme-neon");
        if (t === "system") {
            const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(`theme-${sys}`);
        } else {
            root.classList.add(`theme-${t}`);
        }
        localStorage.setItem("sonara_theme", t);
    };

    const save = () => {
        // Save Profile to LocalStorage
        const profileData = {
            displayName,
            bio,
            avatar: avatarPreview
        };
        try {
            localStorage.setItem("sonara_user_profile", JSON.stringify(profileData));

            // Dispatch event so other components (like TopBar) can update immediately
            window.dispatchEvent(new CustomEvent("sonara-profile-update", { detail: profileData }));

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.error("Failed to save profile", e);
            alert("Failed to save. Image might be too large for storage.");
        }
    };

    /* ═══════ RENDERS ═══════ */

    const renderProfile = () => (
        <div className="space-y-5">
            <Section title="Your Profile" icon={User}>
                <div className="px-5 py-5">
                    <div className="flex items-center gap-5">
                        {/* Avatar with file upload */}
                        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sonara-primary to-sonara-secondary flex items-center justify-center text-3xl font-bold text-white overflow-hidden ring-2 ring-sonara-border/30 ring-offset-2 ring-offset-sonara-bg">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : user?.profilePicture?.["150x150"] ? (
                                    <img src={user.profilePicture["150x150"]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    displayName[0]?.toUpperCase()
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                <Camera className="w-5 h-5 text-white" />
                                <span className="text-[9px] text-white font-medium">Change</span>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="text-xs text-sonara-text-muted mb-1.5 block font-medium">Display Name</label>
                                <input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-sonara-surface border border-sonara-border rounded-xl px-4 py-2.5 text-sm text-sonara-text focus:outline-none focus:border-sonara-primary/50 focus:ring-1 focus:ring-sonara-primary/20 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5 pb-5">
                    <label className="text-xs text-sonara-text-muted mb-1.5 block font-medium">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        maxLength={160}
                        className="w-full bg-sonara-surface border border-sonara-border rounded-xl px-4 py-2.5 text-sm text-sonara-text resize-none focus:outline-none focus:border-sonara-primary/50 focus:ring-1 focus:ring-sonara-primary/20 transition"
                        placeholder="Tell the world about your music taste..."
                    />
                    <p className="text-[10px] text-sonara-text-muted text-right mt-1">{bio.length}/160</p>
                </div>
            </Section>

            {/* Danger Zone */}
            <Section title="Danger Zone" icon={Trash2} danger>
                <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-sonara-text">Delete Account</p>
                        <p className="text-xs text-sonara-text-muted">Permanently remove your account and all data</p>
                    </div>
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 hover:border-red-500/50 transition"
                    >
                        Delete Account
                    </button>
                </div>
            </Section>
        </div>
    );

    const renderAppearance = () => (
        <div className="space-y-5">
            <Section title="Theme" icon={Palette}>
                <div className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {([
                            { key: "dark" as Theme, label: "Dark", icon: Moon, colors: ["#120024", "#1a0533", "#22083d"] },
                            { key: "light" as Theme, label: "Light", icon: Sun, colors: ["#faf5ff", "#f3e8ff", "#ede0fa"] },
                            { key: "neon" as Theme, label: "Neon", icon: Sparkles, colors: ["#030012", "#0a0025", "#0f0035"] },
                            { key: "system" as Theme, label: "System", icon: Monitor, colors: ["#120024", "#888", "#faf5ff"] },
                        ]).map((t) => (
                            <button
                                key={t.key}
                                onClick={() => applyTheme(t.key)}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center group ${theme === t.key
                                    ? "border-sonara-primary bg-sonara-primary/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                    : "border-sonara-border/50 hover:border-sonara-border"
                                    }`}
                            >
                                {theme === t.key && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sonara-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <div className="flex gap-1 justify-center mb-3">
                                    {t.colors.map((c, i) => (
                                        <div key={i} className="w-6 h-10 rounded-md border border-white/10" style={{ background: c }} />
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-1.5">
                                    <t.icon className="w-3.5 h-3.5 text-sonara-text-dim" />
                                    <span className="text-xs font-semibold text-sonara-text">{t.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            <Section title="Interface" icon={Globe}>
                <SettingRow label="Compact Mode" description="Reduce spacing for denser layouts">
                    <Toggle on={compactMode} onChange={setCompactMode} label="Compact mode" />
                </SettingRow>
                <SettingRow label="Animations" description="Enable smooth transitions and micro-animations">
                    <Toggle on={animations} onChange={setAnimations} label="Animations" />
                </SettingRow>
                <SettingRow label="Show Waveform Visualizer" description="Frequency bars in the player bar">
                    <Toggle on={waveform} onChange={setWaveform} label="Waveform" />
                </SettingRow>
            </Section>
        </div>
    );

    const renderAudio = () => (
        <div className="space-y-5">
            <Section title="Playback" icon={Music2}>
                <SettingRow label="Autoplay" description="Automatically play similar tracks when queue ends">
                    <Toggle on={autoplay} onChange={setAutoplay} label="Autoplay" />
                </SettingRow>
                <SettingRow label="Crossfade" description="Smooth transitions between tracks">
                    <div className="flex items-center gap-3">
                        {crossfade && (
                            <div className="flex items-center gap-2">
                                <input type="range" min={1} max={12} value={crossfadeMs} onChange={(e) => setCrossfadeMs(+e.target.value)}
                                    className="w-20 h-1 bg-sonara-border rounded-full accent-sonara-primary" />
                                <span className="text-xs text-sonara-text-muted font-mono w-6">{crossfadeMs}s</span>
                            </div>
                        )}
                        <Toggle on={crossfade} onChange={setCrossfade} label="Crossfade" />
                    </div>
                </SettingRow>
                <SettingRow label="Normalize Volume" description="Set consistent volume across tracks">
                    <Toggle on={normalizeVolume} onChange={setNormalizeVolume} label="Normalize volume" />
                </SettingRow>
            </Section>

            <Section title="Audio Quality" icon={Volume2}>
                <div className="p-5">
                    <div className="grid grid-cols-3 gap-3">
                        {([
                            { key: "low", label: "Data Saver", desc: "128 kbps", icon: "📡" },
                            { key: "normal", label: "Normal", desc: "256 kbps", icon: "🎵" },
                            { key: "high", label: "High Quality", desc: "320 kbps", icon: "🎧" },
                        ] as const).map((q) => (
                            <button
                                key={q.key}
                                onClick={() => setAudioQuality(q.key)}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${audioQuality === q.key
                                    ? "border-sonara-primary bg-sonara-primary/10"
                                    : "border-sonara-border/50 hover:border-sonara-border"
                                    }`}
                            >
                                <div className="text-2xl mb-2">{q.icon}</div>
                                <p className="text-xs font-semibold text-sonara-text">{q.label}</p>
                                <p className="text-[10px] text-sonara-text-muted mt-0.5">{q.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );

    const renderNotifications = () => (
        <Section title="Notification Preferences" icon={Bell}>
            <SettingRow label="Breakout Alerts" description="When an artist hits 70%+ breakout score">
                <Toggle on={notifBreakout} onChange={setNotifBreakout} label="Breakout alerts" />
            </SettingRow>
            <SettingRow label="Staking Rewards" description="Daily reward summaries">
                <Toggle on={notifRewards} onChange={setNotifRewards} label="Staking rewards" />
            </SettingRow>
            <SettingRow label="Friend Activity" description="New followers and friend requests">
                <Toggle on={notifFriends} onChange={setNotifFriends} label="Friend activity" />
            </SettingRow>
            <SettingRow label="Bond Maturity" description="When album bonds are ready to claim">
                <Toggle on={notifBonds} onChange={setNotifBonds} label="Bond maturity" />
            </SettingRow>
            <div className="h-px bg-sonara-border/20 mx-4" />
            <SettingRow label="Browser Notifications" description="Show desktop push notifications">
                <Toggle on={notifBrowser} onChange={setNotifBrowser} label="Browser notifications" />
            </SettingRow>
            <SettingRow label="Email Notifications" description="Receive weekly digest via email">
                <Toggle on={notifEmail} onChange={setNotifEmail} label="Email notifications" />
            </SettingRow>
        </Section>
    );

    const renderPrivacy = () => (
        <div className="space-y-5">
            <Section title="Privacy" icon={Eye}>
                <SettingRow label="Show Listening Activity" description="Let friends see what you're playing">
                    <div className="flex items-center gap-2">
                        {showListening ? <Eye className="w-4 h-4 text-sonara-text-muted" /> : <EyeOff className="w-4 h-4 text-sonara-text-muted" />}
                        <Toggle on={showListening} onChange={setShowListening} label="Show listening" />
                    </div>
                </SettingRow>
                <SettingRow label="Public Portfolio" description="Make your investment holdings visible">
                    <Toggle on={showPortfolio} onChange={setShowPortfolio} label="Public portfolio" />
                </SettingRow>
                <SettingRow label="Public Profile" description="Allow everyone to view your profile">
                    <Toggle on={publicProfile} onChange={setPublicProfile} label="Public profile" />
                </SettingRow>
            </Section>

            <Section title="Data & Security" icon={Lock}>
                <SettingRow label="Analytics" description="Help improve SONARA by sharing usage data">
                    <Toggle on={analyticsOptIn} onChange={setAnalyticsOptIn} label="Analytics" />
                </SettingRow>
                <SettingRow label="Export Your Data" description="Download a copy of all your data">
                    <button className="px-3 py-1.5 rounded-lg btn-secondary text-xs flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                </SettingRow>
            </Section>
        </div>
    );

    const renderConnections = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const twitterConnected = session?.user?.email ? false : ((session as any)?.provider === "twitter");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const discordConnected = (session as any)?.user?.image?.includes("discord") || false;

        return (
            <Section title="Connected Services" icon={Link2}>
                {[
                    {
                        name: "Audius",
                        emoji: "🎵",
                        color: "bg-purple-500/20",
                        connected: isLoggedIn,
                        handle: user?.handle ? `@${user.handle}` : undefined,
                        action: () => alert("Use Audius login on main page")
                    },
                    {
                        name: "Phantom Wallet",
                        emoji: "👻",
                        color: "bg-orange-500/20",
                        connected: connected,
                        handle: connected ? "Connected" : undefined,
                        action: connected ? disconnect : () => setVisible(true)
                    },
                    {
                        name: "Solflare Wallet",
                        emoji: "🌞",
                        color: "bg-amber-500/20",
                        connected: connected,
                        handle: connected ? "Connected" : undefined,
                        action: connected ? disconnect : () => setVisible(true)
                    },
                    {
                        name: "Discord",
                        emoji: "💬",
                        color: "bg-indigo-500/20",
                        connected: !!session?.user && (session as any)?.user?.image?.includes("discord"), // Temporary check
                        handle: session?.user?.name || undefined,
                        action: () => signIn("discord")
                    },
                    {
                        name: "Twitter / X",
                        emoji: "𝕏",
                        color: "bg-sky-500/20",
                        connected: !!session?.user && !(session as any)?.user?.image?.includes("discord"), // Temporary check
                        handle: session?.user?.name || undefined,
                        action: () => signIn("twitter")
                    },
                ].map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${svc.color} flex items-center justify-center text-lg`}>
                                {svc.emoji}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-sonara-text">{svc.name}</p>
                                <p className="text-[10px] text-sonara-text-muted">
                                    {svc.connected ? (svc.handle || "Connected") : "Not connected"}
                                </p>
                            </div>
                        </div>
                        {svc.connected ? (
                            <button
                                onClick={svc.name === "Audius" ? undefined : svc.action}
                                className="text-xs px-3 py-1.5 rounded-full bg-sonara-success/15 text-sonara-success font-medium flex items-center gap-1 hover:bg-sonara-success/25 transition"
                            >
                                <Check className="w-3 h-3" /> Connected
                            </button>
                        ) : (
                            <button
                                onClick={svc.action}
                                className="text-xs px-4 py-1.5 rounded-full btn-secondary font-medium"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                ))}
            </Section>
        );
    };

    const renderAbout = () => (
        <div className="space-y-5">
            <Section title="About SONARA" icon={Zap}>
                <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-sonara-glow mx-auto mb-4 flex items-center justify-center">
                        <Music2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold gradient-text mb-1">SONARA</h3>
                    <p className="text-xs text-sonara-text-muted mb-4">Web3 Music Investment & Discovery</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-sonara-text-muted">
                        <span>Version <span className="font-mono text-sonara-text-dim">2.0.0</span></span>
                        <span>•</span>
                        <span>Built by <span className="text-sonara-primary font-semibold">Rav3n</span></span>
                    </div>
                </div>
            </Section>

            <div className="glass rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-semibold text-sonara-text mb-3">Keyboard Shortcuts</h4>
                {[
                    { keys: "Space", action: "Play / Pause" },
                    { keys: "→", action: "Next Track" },
                    { keys: "←", action: "Previous Track" },
                    { keys: "↑ / ↓", action: "Volume Up / Down" },
                    { keys: "M", action: "Mute / Unmute" },
                    { keys: "S", action: "Toggle Shuffle" },
                    { keys: "R", action: "Cycle Repeat" },
                ].map((s) => (
                    <div key={s.keys} className="flex items-center justify-between text-xs">
                        <span className="text-sonara-text-muted">{s.action}</span>
                        <kbd className="bg-sonara-surface border border-sonara-border rounded-md px-2 py-0.5 font-mono text-sonara-text-dim text-[10px]">{s.keys}</kbd>
                    </div>
                ))}
            </div>
        </div>
    );

    const tabContent: Record<Tab, () => React.ReactNode> = {
        profile: renderProfile,
        appearance: renderAppearance,
        audio: renderAudio,
        notifications: renderNotifications,
        privacy: renderPrivacy,
        connections: renderConnections,
        about: renderAbout,
    };

    return (
        <div className="animate-slide-up max-w-5xl mx-auto">
            {/* Delete confirmation modal */}
            <DeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">Settings</h1>
                    <p className="text-sm text-sonara-text-muted mt-1">Manage your profile, preferences & connections</p>
                </div>
                <button
                    onClick={save}
                    className={`btn-primary text-sm transition-all ${saved ? "!bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : ""}`}
                >
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Saved ✓" : "Save Changes"}
                </button>
            </div>

            {/* Mobile tab bar */}
            <div className="md:hidden mb-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${activeTab === tab.key
                                ? "bg-sonara-primary/15 text-sonara-primary-light font-medium"
                                : "text-sonara-text-muted hover:text-sonara-text"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6">
                {/* Desktop Sidebar Tabs */}
                <nav className="hidden md:flex flex-col w-[200px] flex-shrink-0 gap-1 sticky top-6 self-start">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all text-sm group ${activeTab === tab.key
                                ? "bg-sonara-primary/15 text-sonara-primary-light font-medium"
                                : "text-sonara-text-dim hover:text-sonara-text hover:bg-white/5"
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.key ? "text-sonara-primary-light" : "text-sonara-text-muted"}`} />
                            {tab.label}
                            {activeTab === tab.key && <ChevronRight className="w-3.5 h-3.5 ml-auto text-sonara-primary/50" />}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {tabContent[activeTab]()}
                </div>
            </div>
        </div>
    );
}
