"use client";

import { useRef, useEffect, useState } from "react";
import {
    Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
    Volume2, VolumeX, X, ChevronDown, Heart, ListMusic, Music2,
} from "lucide-react";
import { useAudioStore } from "@/lib/audioStore";

/* ─── Helpers ─── */
function formatTime(s: number): string {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/* ═══════════════════════════════════════════════════════════════════
   Expanded Player — Full-viewport pop-out with visualizer & animations
   ═══════════════════════════════════════════════════════════════════ */
export function ExpandedPlayer({ onClose }: { onClose: () => void }) {
    const {
        currentTrack, isPlaying, setIsPlaying, volume, setVolume,
        shuffleMode, repeatMode, toggleShuffle, setRepeatMode,
        nextTrack, previousTrack, currentTime, duration,
        setCurrentTime, queue,
        audioRef, analyserRef,          // ← use shared refs from store
    } = useAudioStore();

    /* ─── Refs ─── */
    const containerRef = useRef<HTMLDivElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const vizCanvasRef = useRef<HTMLCanvasElement>(null);
    const bgAnimRef = useRef<number>(0);
    const vizAnimRef = useRef<number>(0);

    /* ─── Local state ─── */
    const [muted, setMuted] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showQueue, setShowQueue] = useState(false);

    /* ─── Volume sync ─── */
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) audio.volume = muted ? 0 : volume;
    }, [muted, volume, audioRef]);

    /* ─── Background canvas — orbital particles & gradient pulse ─── */
    useEffect(() => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const particles: { x: number; y: number; size: number; speed: number; angle: number; orbit: number; hue: number; opacity: number }[] = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: 0, y: 0,
                size: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.003 + 0.001,
                angle: Math.random() * Math.PI * 2,
                orbit: Math.random() * 300 + 100,
                hue: Math.random() * 60 + 250,
                opacity: Math.random() * 0.4 + 0.15,
            });
        }

        let t = 0;
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            t += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2 - 30;

            // Radial glow
            const pulseSize = 250 + Math.sin(t * 2) * 40;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize);
            grad.addColorStop(0, isPlaying ? "rgba(168, 85, 247, 0.12)" : "rgba(168, 85, 247, 0.05)");
            grad.addColorStop(0.5, "rgba(139, 92, 246, 0.04)");
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Particles
            particles.forEach((p) => {
                p.angle += p.speed * (isPlaying ? 1 : 0.2);
                const wobble = Math.sin(t * 3 + p.angle * 5) * 15;
                p.x = cx + Math.cos(p.angle) * (p.orbit + wobble);
                p.y = cy + Math.sin(p.angle) * (p.orbit * 0.6 + wobble);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * (isPlaying ? 1 : 0.4)})`;
                ctx.fill();
                if (p.size > 1.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.12})`;
                    ctx.fill();
                }
            });

            // Orbiting ellipse
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.06 + Math.sin(t) * 0.03})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 220 + Math.sin(t * 1.5) * 10, 140 + Math.cos(t * 1.5) * 10, t * 0.1, 0, Math.PI * 2);
            ctx.stroke();

            bgAnimRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(bgAnimRef.current); window.removeEventListener("resize", resize); };
    }, [isPlaying]);

    /* ─── Circular waveform — reads from shared analyserRef ─── */
    useEffect(() => {
        const canvas = vizCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = 320;
        canvas.width = size;
        canvas.height = size;

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            const cx = size / 2;
            const cy = size / 2;

            const analyser = analyserRef.current;
            let dataArray: Uint8Array;

            if (analyser) {
                // ★ REAL frequency data from the shared analyser
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                analyser.getByteFrequencyData(dataArray as any);
            } else {
                // Simulated wave as fallback
                dataArray = new Uint8Array(64);
                const time = Date.now() / 1000;
                for (let i = 0; i < 64; i++) {
                    dataArray[i] = isPlaying
                        ? Math.floor(80 + Math.sin(time * 3 + i * 0.3) * 50 + Math.sin(time * 7 + i * 0.7) * 30)
                        : Math.floor(20 + Math.sin(time + i * 0.5) * 10);
                }
            }

            const bars = 64;
            const innerRadius = 110;
            const maxBarLen = 45;

            for (let i = 0; i < bars; i++) {
                const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
                const val = (dataArray[i % dataArray.length] || 0) / 255;
                const barLen = val * maxBarLen + 2;

                const x1 = cx + Math.cos(angle) * innerRadius;
                const y1 = cy + Math.sin(angle) * innerRadius;
                const x2 = cx + Math.cos(angle) * (innerRadius + barLen);
                const y2 = cy + Math.sin(angle) * (innerRadius + barLen);

                const grad = ctx.createLinearGradient(x1, y1, x2, y2);
                grad.addColorStop(0, `hsla(${270 + i * 1.5}, 85%, 65%, ${0.5 + val * 0.5})`);
                grad.addColorStop(1, `hsla(${300 + i * 1.5}, 90%, 75%, ${0.2 + val * 0.6})`);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.stroke();

                // Mirror inward
                const innerLen = val * maxBarLen * 0.3 + 1;
                const xi = cx + Math.cos(angle) * (innerRadius - innerLen);
                const yi = cy + Math.sin(angle) * (innerRadius - innerLen);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(xi, yi);
                ctx.strokeStyle = `hsla(${270 + i * 2}, 80%, 70%, ${0.15 + val * 0.2})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Glow ring
            ctx.beginPath();
            ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(168, 85, 247, ${isPlaying ? 0.15 : 0.06})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            vizAnimRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(vizAnimRef.current);
    }, [isPlaying, analyserRef]);

    /* ─── Play / Pause — uses the SHARED audio element ─── */
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => { });
        }
    };

    /* ─── Seek — operates on the SHARED audio element ─── */
    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = pct * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    /* ─── Repeat cycle ─── */
    const cycleRepeat = () => {
        const modes: Array<"none" | "one" | "all"> = ["none", "all", "one"];
        const idx = modes.indexOf(repeatMode);
        setRepeatMode(modes[(idx + 1) % modes.length]);
    };

    const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

    /* ─── Keyboard ─── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === " " && e.target === document.body) {
                e.preventDefault();
                togglePlay();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClose, isPlaying, currentTrack]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0015 0%, #120024 30%, #0d001a 60%, #05000f 100%)" }}
        >
            {/* Background effects canvas */}
            <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Top controls */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 lg:p-6 z-10">
                <button onClick={onClose} className="text-sonara-text-muted hover:text-white transition p-2 rounded-xl hover:bg-white/5">
                    <ChevronDown className="w-6 h-6" />
                </button>
                <p className="text-xs text-sonara-text-muted uppercase tracking-widest font-medium">Now Playing</p>
                <button onClick={() => setShowQueue(!showQueue)} className={`p-2 rounded-xl transition ${showQueue ? "text-sonara-primary bg-white/5" : "text-sonara-text-muted hover:text-white hover:bg-white/5"}`}>
                    <ListMusic className="w-5 h-5" />
                </button>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg px-6 mt-12">
                {/* Album art with circular visualizer */}
                <div className="relative w-[280px] h-[280px] lg:w-[320px] lg:h-[320px]">
                    <canvas ref={vizCanvasRef} className="absolute inset-0 w-full h-full" />
                    <div className={`absolute inset-0 m-auto w-[180px] h-[180px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden shadow-2xl shadow-purple-900/40 ${isPlaying ? "animate-[spin_20s_linear_infinite]" : ""}`}>
                        {currentTrack?.artwork ? (
                            <img src={currentTrack.artwork} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-sonara-primary to-sonara-secondary flex items-center justify-center">
                                <Music2 className="w-12 h-12 text-white/80" />
                            </div>
                        )}
                        <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-[#0a0015] border-2 border-white/10" />
                    </div>
                    <div className={`absolute inset-0 rounded-full border border-purple-500/10 ${isPlaying ? "animate-ping" : ""}`} style={{ animationDuration: "3s" }} />
                </div>

                {/* Track info */}
                <div className="text-center mt-2">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-white truncate max-w-[400px]">
                        {currentTrack?.title || "No Track Selected"}
                    </h2>
                    <p className="text-sm text-sonara-text-muted mt-1">{currentTrack?.artist || "—"}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md">
                    <div className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group" onClick={seek}>
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 relative transition-all"
                            style={{ width: `${pct}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs font-mono text-sonara-text-muted">{formatTime(currentTime)}</span>
                        <span className="text-xs font-mono text-sonara-text-muted">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mt-2">
                    <button onClick={toggleShuffle} className={`transition-all ${shuffleMode ? "text-sonara-primary drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" : "text-sonara-text-muted hover:text-white"}`} aria-label="Shuffle">
                        <Shuffle className="w-5 h-5" />
                    </button>
                    <button onClick={previousTrack} disabled={!currentTrack} className="text-sonara-text-dim hover:text-white transition disabled:opacity-30" aria-label="Previous">
                        <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                        onClick={togglePlay}
                        disabled={!currentTrack}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
                    </button>
                    <button onClick={nextTrack} disabled={!currentTrack} className="text-sonara-text-dim hover:text-white transition disabled:opacity-30" aria-label="Next">
                        <SkipForward className="w-6 h-6" />
                    </button>
                    <button onClick={cycleRepeat} className={`transition-all ${repeatMode !== "none" ? "text-sonara-primary drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" : "text-sonara-text-muted hover:text-white"}`} aria-label={`Repeat: ${repeatMode}`}>
                        {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => setMuted(!muted)} className="text-sonara-text-muted hover:text-white transition">
                        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={muted ? 0 : volume}
                        onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                        className="w-28 h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-purple-500"
                        aria-label="Volume"
                    />
                </div>

                {/* Like */}
                <div className="flex items-center gap-4 mt-1">
                    <button onClick={() => setLiked(!liked)} className={`transition-all ${liked ? "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] scale-110" : "text-sonara-text-muted hover:text-pink-400"}`}>
                        <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Queue panel */}
            {showQueue && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/60 backdrop-blur-xl border-l border-white/5 z-20 flex flex-col animate-slide-up">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-white">Up Next</h3>
                        <button onClick={() => setShowQueue(false)} className="text-sonara-text-muted hover:text-white transition">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {queue.length === 0 ? (
                            <p className="text-xs text-sonara-text-muted text-center py-8">Queue is empty</p>
                        ) : (
                            queue.map((track, i) => (
                                <div key={`${track.id}-${i}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition group">
                                    <div className="w-8 h-8 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                                        {track.artwork ? (
                                            <img src={track.artwork} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs">🎵</div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-white truncate">{track.title}</p>
                                        <p className="text-[10px] text-sonara-text-muted truncate">{track.artist}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
