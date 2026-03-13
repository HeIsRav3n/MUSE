"use client";

import { useRef, useEffect, useState } from "react";
import {
    Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
    Volume2, VolumeX, X, ChevronDown, Heart, ListMusic, Music2,
} from "lucide-react";
import { useAudioData, useAudioPlayback } from "@/lib/audioStore";

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
        currentTrack, shuffleMode, repeatMode, toggleShuffle, setRepeatMode,
        nextTrack, previousTrack, queue, audioRef, analyserRef,
    } = useAudioData();

    const {
        isPlaying, setIsPlaying, volume, setVolume,
        currentTime, duration, setCurrentTime,
    } = useAudioPlayback();

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

    const [vizMode, setVizMode] = useState<"aura" | "vortex" | "dna">("aura");

    /* ─── Circular waveform — reads from shared analyserRef ─── */
    useEffect(() => {
        const canvas = vizCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = 600;
        canvas.width = size;
        canvas.height = size;

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            const cx = size / 2;
            const cy = size / 2;

            const analyser = analyserRef.current;
            let dataArray: Uint8Array;

            if (analyser) {
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);
            } else {
                dataArray = new Uint8Array(64).map((_, i) => Math.sin(Date.now()*0.01 + i)*50 + 100);
            }

            const time = Date.now() / 1000;
            const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
            const intensity = avg / 128;

            if (vizMode === "aura") {
                const bars = 120;
                const innerRadius = 140;
                const maxBarLen = 80;

                for (let i = 0; i < bars; i++) {
                    const angle = (i / bars) * Math.PI * 2 - Math.PI / 2 + time * 0.1;
                    const val = (dataArray[i % 64] || 0) / 255;
                    const barLen = val * maxBarLen * (1 + intensity * 0.5);

                    const x1 = cx + Math.cos(angle) * innerRadius;
                    const y1 = cy + Math.sin(angle) * innerRadius;
                    const x2 = cx + Math.cos(angle) * (innerRadius + barLen);
                    const y2 = cy + Math.sin(angle) * (innerRadius + barLen);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = `hsla(${270 + i * 2}, 85%, 65%, ${0.4 + val * 0.6})`;
                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";
                    ctx.stroke();

                    // Flares
                    if (val > 0.8) {
                        ctx.beginPath();
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(x2 + Math.cos(angle)*20, y2 + Math.sin(angle)*20);
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            } 
            else if (vizMode === "vortex") {
                const count = 200;
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2 + time;
                    const val = (dataArray[i % 64] / 255);
                    const dist = (i % 20) * 15 + (1 - val) * 100;
                    const x = cx + Math.cos(angle + dist * 0.01) * dist;
                    const y = cy + Math.sin(angle + dist * 0.01) * dist;
                    
                    ctx.fillStyle = `hsla(${280 + val * 50}, 100%, 70%, ${val * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 1 + val * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            else if (vizMode === "dna") {
                const strands = 2;
                const points = 40;
                for (let s = 0; s < strands; s++) {
                    ctx.beginPath();
                    for (let i = 0; i < points; i++) {
                        const y = (i / points) * 300 - 150;
                        const val = dataArray[i] / 255;
                        const angle = i * 0.4 + time * 2 + s * Math.PI;
                        const x = Math.sin(angle) * (40 + val * 40);
                        
                        const px = cx + x;
                        const py = cy + y;
                        
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);

                        if (i % 4 === 0) {
                            ctx.fillStyle = s === 0 ? "#e024c3" : "#6333ff";
                            ctx.beginPath();
                            ctx.arc(px, py, 3 + val * 5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }

            vizAnimRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(vizAnimRef.current);
    }, [isPlaying, analyserRef, vizMode]);

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
                <button onClick={onClose} className="text-muse-text-muted hover:text-white transition p-2 rounded-xl hover:bg-white/5">
                    <ChevronDown className="w-6 h-6" />
                </button>
                <p className="text-xs text-muse-text-muted uppercase tracking-widest font-medium">Now Playing</p>
                <button onClick={() => setShowQueue(!showQueue)} className={`p-2 rounded-xl transition ${showQueue ? "text-muse-primary bg-white/5" : "text-muse-text-muted hover:text-white hover:bg-white/5"}`}>
                    <ListMusic className="w-5 h-5" />
                </button>
            </div>

            {/* Main content */}
            <div className={`relative z-10 flex flex-col items-center gap-8 w-full max-w-lg px-6 mt-12 transition-all duration-300`}>
                
                {/* Album art with circular visualizer & 💓 Beat Sync */}
                <div 
                    className="relative w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] flex items-center justify-center"
                    style={{ perspective: '1200px' }}
                >
                    <canvas ref={vizCanvasRef} className="absolute inset-0 w-full h-full" />
                    
                    {/* Floating 3D Artwork Frame */}
                    <div 
                        className={`relative w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-75`}
                        style={{ 
                            transformOrigin: 'center center',
                            transform: `rotateY(${Math.sin(currentTime * 0.5) * 10}deg) rotateX(${Math.cos(currentTime * 0.3) * 5}deg) scale(${1 + (vizAnimRef.current % 100 < 5 ? 0.05 : 0)})`,
                            boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 ${20 + (Math.random() * 20)}px rgba(168, 85, 247, 0.4)`
                        }}
                    >
                        {currentTrack?.artwork ? (
                            <img src={currentTrack.artwork} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muse-primary to-muse-secondary flex items-center justify-center">
                                <Music2 className="w-16 h-16 text-white/50" />
                            </div>
                        )}
                        
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Ambient Glow Ring */}
                    <div 
                        className={`absolute inset-0 rounded-full border border-muse-primary/20 opacity-30 ${isPlaying ? "animate-ping" : ""}`} 
                        style={{ 
                            animationDuration: `${0.8 + (Math.random() * 0.4)}s`,
                            transform: `scale(${1.2 + (Math.random() * 0.1)})`
                        }} 
                    />
                </div>

                {/* Track info with subtle bounce */}
                <div className="text-center mt-2 group cursor-default">
                    <h2 className="text-2xl lg:text-3xl font-display font-bold text-white truncate max-w-[450px] drop-shadow-lg tracking-tight">
                        {currentTrack?.title || "No Track Selected"}
                    </h2>
                    <p className="text-sm font-medium text-muse-primary-light mt-2 uppercase tracking-[0.2em] opacity-80">
                        {currentTrack?.artist || "—"}
                    </p>
                </div>

                {/* Progress bar with rhythm pulse */}
                <div className="w-full max-w-md">
                    <div className="relative h-2 bg-white/5 rounded-full cursor-pointer group/seek" onClick={seek}>
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-muse-primary via-fuchsia-400 to-muse-primary-light relative transition-all"
                            style={{ 
                                width: `${pct}%`,
                                boxShadow: isPlaying ? '0 0 15px rgba(224, 36, 195, 0.4)' : 'none'
                            }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/seek:scale-100 transition-transform shadow-[0_0_15px_#fff]" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-3 font-mono text-[10px] text-muse-text-muted tracking-widest">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Visualizer Mode Toggle */}
                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                    {(["aura", "vortex", "dna"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setVizMode(m)}
                            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${vizMode === m ? "bg-muse-primary text-white shadow-glow-pink" : "text-muse-text-dim hover:text-white"}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mt-2">
                    <button onClick={toggleShuffle} className={`transition-all ${shuffleMode ? "text-muse-primary drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" : "text-muse-text-muted hover:text-white"}`} aria-label="Shuffle">
                        <Shuffle className="w-5 h-5" />
                    </button>
                    <button onClick={previousTrack} disabled={!currentTrack} className="text-muse-text-dim hover:text-white transition disabled:opacity-30" aria-label="Previous">
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
                    <button onClick={nextTrack} disabled={!currentTrack} className="text-muse-text-dim hover:text-white transition disabled:opacity-30" aria-label="Next">
                        <SkipForward className="w-6 h-6" />
                    </button>
                    <button onClick={cycleRepeat} className={`transition-all ${repeatMode !== "none" ? "text-muse-primary drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" : "text-muse-text-muted hover:text-white"}`} aria-label={`Repeat: ${repeatMode}`}>
                        {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => setMuted(!muted)} className="text-muse-text-muted hover:text-white transition">
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
                    <button onClick={() => setLiked(!liked)} className={`transition-all ${liked ? "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] scale-110" : "text-muse-text-muted hover:text-pink-400"}`}>
                        <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Queue panel */}
            {showQueue && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/60 backdrop-blur-xl border-l border-white/5 z-20 flex flex-col animate-slide-up">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-white">Up Next</h3>
                        <button onClick={() => setShowQueue(false)} className="text-muse-text-muted hover:text-white transition">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {queue.length === 0 ? (
                            <p className="text-xs text-muse-text-muted text-center py-8">Queue is empty</p>
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
                                        <p className="text-[10px] text-muse-text-muted truncate">{track.artist}</p>
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
