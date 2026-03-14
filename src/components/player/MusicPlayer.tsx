"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Repeat, Repeat1, Shuffle, Loader2, AlertCircle,
    ChevronDown, ChevronUp, Maximize2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAudioData, useAudioPlayback, type QueueTrack } from "@/lib/audioStore";
import { handleAudioError, handleNetworkError } from "@/lib/errorHandler";
import { trackAudioPerformance, trackComponentPerformance } from "@/lib/performanceMonitor";

const PlayerControlsDropdown = dynamic(() => import("./PlayerControlsDropdown").then((m) => m.PlayerControlsDropdown), { ssr: false });
const ExpandedPlayer = dynamic(() => import("./ExpandedPlayer").then((m) => m.ExpandedPlayer), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const webkitAudioContext: any;

function formatTime(s: number): string {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
    const {
        currentTrack,
        queue,
        setIsLoading,
        setError,
        isLoading,
        error,
        shuffleMode,
        repeatMode,
        toggleShuffle,
        setRepeatMode,
        nextTrack,
        previousTrack,
        audioRef,
        analyserRef,
        aiDjMode,
    } = useAudioData();

    const {
        isPlaying,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        volume,
        setVolume,
    } = useAudioPlayback();

    /* ─── Refs ─── */
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animRef = useRef<number>(0);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const currentSrcRef = useRef<string>("");          // ← KEY: track what's loaded
    const eventsRef = useRef<[string, EventListener][]>([]);

    /* ─── Local state (UI only) ─── */
    const [localTime, setLocalTime] = useState(0);
    const [localDuration, setLocalDuration] = useState(0);
    const [bufferPct, setBufferPct] = useState(0);
    const [muted, setMuted] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [expanded, setExpanded] = useState(false);

    /* ─── repeatMode & nextTrack refs so audio handlers always see latest ─── */
    const repeatModeRef = useRef(repeatMode);
    repeatModeRef.current = repeatMode;
    const nextTrackRef = useRef(nextTrack);
    nextTrackRef.current = nextTrack;

    /* ─── Initialize persistent Audio element once ─── */
    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            audio.preload = "metadata";
            audioRef.current = audio;

            // Attach PERSISTENT event handlers (never removed)
            const onPlay = () => setIsPlaying(true);
            const onPause = () => setIsPlaying(false);
            const onTimeUpdate = () => {
                setLocalTime(audio.currentTime);
                setCurrentTime(audio.currentTime);
            };
            const onLoadedMeta = () => {
                setLocalDuration(audio.duration);
                setDuration(audio.duration);
                setIsLoading(false);
            };
            const onCanPlay = () => setIsLoading(false);
            const onWaiting = () => setIsLoading(true);
            const onEnded = () => {
                if (repeatModeRef.current === "one") {
                    audio.currentTime = 0;
                    audio.play().catch(() => { });
                } else {
                    nextTrackRef.current();
                }
            };
            const onError = (e: Event) => {
                const target = e.target as HTMLAudioElement;
                const code = target.error?.code;
                let msg = "Could not load track";

                // Auto-skip on source error (fix for user issue)
                if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || code === MediaError.MEDIA_ERR_DECODE) {
                    const errorMsg = `Audio source error for "${currentTrack?.title}", auto-skipping to next track`;
                    console.warn(errorMsg);
                    
                    handleAudioError(errorMsg, target.error || undefined, {
                        trackId: currentTrack?.id,
                        trackTitle: currentTrack?.title,
                        errorCode: code,
                        autoAction: 'skip_to_next'
                    });
                    
                    setTimeout(() => nextTrack(), 500); // reduced delay
                    return;
                }

                if (code === MediaError.MEDIA_ERR_NETWORK) {
                    msg = "Network error — check connection";
                    handleNetworkError(msg, target.error || undefined, {
                        trackId: currentTrack?.id,
                        trackTitle: currentTrack?.title,
                        errorCode: code
                    });
                } else if (code === MediaError.MEDIA_ERR_DECODE) {
                    msg = "Audio format not supported";
                    handleAudioError(msg, target.error || undefined, {
                        trackId: currentTrack?.id,
                        trackTitle: currentTrack?.title,
                        errorCode: code,
                        format: 'unsupported'
                    });
                } else if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    msg = "Audio source not supported";
                    handleAudioError(msg, target.error || undefined, {
                        trackId: currentTrack?.id,
                        trackTitle: currentTrack?.title,
                        errorCode: code,
                        source: 'unsupported'
                    });
                }
                
                setError(msg);
                setIsLoading(false);
            };
            const onProgress = () => {
                if (audio.buffered.length > 0 && audio.duration) {
                    setBufferPct((audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100);
                }
            };

            // AI-DJ: Crossfade logic would go here in a real implementation
            // For now, we simulate "Smart Queueing" in onEnded if queue is empty
            const onEndedWrapped = () => {
                if (queue.length === 0 && (window as any).museAiDjMode) {
                    // Logic handled in store or effect
                }
                onEnded();
            };

            audio.addEventListener("play", onPlay);
            audio.addEventListener("pause", onPause);
            audio.addEventListener("timeupdate", onTimeUpdate);
            audio.addEventListener("loadedmetadata", onLoadedMeta);
            audio.addEventListener("canplay", onCanPlay);
            audio.addEventListener("waiting", onWaiting);
            audio.addEventListener("ended", onEndedWrapped); // Key: onEnded handles next track
            audio.addEventListener("error", onError);
            audio.addEventListener("progress", onProgress);
        }

        return () => {
            // Only runs on full unmount (app close)
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
                audioCtxRef.current.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ─── Track changed → swap src ONLY if URL actually changed ─── */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack?.audioUrl) return;

        // *** KEY FIX: Skip if the same URL is already loaded ***
        if (currentSrcRef.current === currentTrack.audioUrl) return;

        // Validate URL
        try {
            new URL(currentTrack.audioUrl);
        } catch {
            setError("Invalid audio URL");
            setIsLoading(false);
            return;
        }

        setError(null);
        setIsLoading(true);
        setLocalTime(0);
        setBufferPct(0);

        // Track track loading performance
        const trackLoadStart = performance.now();

        // If minimized, auto-expand
        if (minimized) setMinimized(false);

        // Initialize AudioContext + AnalyserNode
        if (!audioCtxRef.current) {
            const AC = window.AudioContext || webkitAudioContext;
            if (AC) {
                try {
                    audioCtxRef.current = new AC();
                } catch (error) {
                    handleAudioError('Failed to create AudioContext', error instanceof Error ? error : new Error(String(error)), {
                        action: 'audio_context_creation_failed'
                    });
                }
            } else {
                handleAudioError('Web Audio API not supported', undefined, {
                    action: 'web_audio_unsupported'
                });
            }
        }
        const ctx = audioCtxRef.current;

        // Connect audio → analyser → destination (only once)
        if (ctx && !sourceRef.current) {
            try {
                sourceRef.current = ctx.createMediaElementSource(audio);
                analyserRef.current = ctx.createAnalyser();
                analyserRef.current.fftSize = 256;
                analyserRef.current.smoothingTimeConstant = 0.8;
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(ctx.destination);
            } catch (error) {
                handleAudioError('Failed to connect audio nodes', error instanceof Error ? error : new Error(String(error)), {
                    action: 'audio_node_connection_failed'
                });
            }
        }

        // Resume AudioContext (autoplay policy)
        if (ctx && ctx.state === "suspended") {
            ctx.resume().catch(error => {
                handleAudioError('Failed to resume AudioContext', error instanceof Error ? error : new Error(String(error)), {
                    action: 'audio_context_resume_failed'
                });
            });
        }

        // Load the new track
        currentSrcRef.current = currentTrack.audioUrl;
        
        if (!currentTrack.audioUrl) {
            console.error("Missing audioUrl for track:", currentTrack.title);
            setError("Audio source missing");
            setIsLoading(false);
            return;
        }

        audio.src = currentTrack.audioUrl;
        audio.load();
        audio.play().then(() => {
            setIsPlaying(true);
            // Track successful track load time
            const trackLoadTime = performance.now() - trackLoadStart;
            trackAudioPerformance('track_load_success', trackLoadTime, {
                trackId: currentTrack.id,
                trackTitle: currentTrack.title,
                audioUrl: currentTrack.audioUrl,
                fileSize: 'unknown' // Could be enhanced with fetch HEAD request
            });
        }).catch((error) => {
            // Track failed track load time
            const trackLoadTime = performance.now() - trackLoadStart;
            trackAudioPerformance('track_load_failed', trackLoadTime, {
                trackId: currentTrack.id,
                trackTitle: currentTrack.title,
                audioUrl: currentTrack.audioUrl,
                error: error.message
            });
            
            handleAudioError('Failed to play audio', error instanceof Error ? error : new Error(String(error)), {
                trackId: currentTrack.id,
                trackTitle: currentTrack.title,
                audioUrl: currentTrack.audioUrl,
                action: 'audio_playback_failed'
            });
            setIsPlaying(false);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack?.audioUrl]);

    /* ─── Sync play/pause from external triggers ─── */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audio.src) return;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying, setIsPlaying]);

    /* ─── Volume sync ─── */
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
    }, [volume, muted]);

    /* ─── Visualizer mode ─── */
    const [vizMode, setVizMode] = useState<"waveform" | "strings" | "alien" | "cybergrid" | "prismrain" | "off">(() => {
        if (typeof window !== "undefined") return (localStorage.getItem("muse_viz_mode") as any) || "waveform";
        return "waveform";
    });

    useEffect(() => {
        const handler = (e: Event) => {
            const mode = (e as CustomEvent).detail?.mode;
            if (mode) setVizMode(mode);
        };
        window.addEventListener("muse-viz-mode", handler);
        return () => window.removeEventListener("muse-viz-mode", handler);
    }, []);

    /* ─── Canvas multi-mode visualizer ─── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser || vizMode === "off") {
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let animationId = 0;
        let t = 0;

        // Persistent particles for some modes
        const particles: any[] = [];
        for(let i=0; i<30; i++) {
            particles.push({ 
                x: Math.random() * canvas.width, 
                y: Math.random() * canvas.height, 
                v: 1+Math.random()*3,
                size: 2+Math.random()*4,
                color: i % 2 === 0 ? "#e024c3" : "#6333ff"
            });
        }

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            // *** PERFORMANCE OPTIMIZATION: Stop loop if not needed ***
            if (document.hidden || minimized) return;

            t += 0.016;
            analyser.getByteFrequencyData(dataArray);
            
            // --- Beat Detection Logic (Optimized) ---
            const lowFreqRange = dataArray.slice(0, 10);
            const avgLow = lowFreqRange.reduce((a, b) => a + b, 0) / lowFreqRange.length;
            const normalizedIntensity = Math.pow(avgLow / 255, 2); 
            beatRef.current = beatRef.current * 0.8 + normalizedIntensity * 0.2;
            
            // Only update state every 100ms to avoid re-render flood
            if (t % 0.1 < 0.02) setBeatIntensity(beatRef.current);

            const cw = canvas.width;
            const ch = canvas.height;
            ctx.clearRect(0, 0, cw, ch);

            if (vizMode === "waveform") {
                const barCount = 100;
                const barWidth = cw / barCount;
                ctx.globalAlpha = 0.5 + beatRef.current * 0.5;
                for (let i = 0; i < barCount; i++) {
                    const val = dataArray[Math.floor((i/barCount)*dataArray.length*0.4)] / 255;
                    const h = val * ch * 0.8;
                    const grad = ctx.createLinearGradient(0, ch-h, 0, ch);
                    grad.addColorStop(0, "#e024c3");
                    grad.addColorStop(1, "#6333ff");
                    ctx.fillStyle = grad;
                    ctx.fillRect(i * barWidth, ch - h, barWidth - 1, h);
                }
            } 
            else if (vizMode === "strings") {
                const count = 30;
                const spacing = cw / (count + 1);
                ctx.lineWidth = 2;
                for (let i = 1; i <= count; i++) {
                    const val = dataArray[i * 4] / 255;
                    const offset = val * 60 * beatRef.current * 2;
                    ctx.beginPath();
                    ctx.moveTo(i * spacing, 0);
                    ctx.quadraticCurveTo(i * spacing + offset * Math.sin(t * 8 + i), ch/2, i * spacing, ch);
                    ctx.strokeStyle = `hsla(${280 + val * 60}, 100%, 65%, ${0.3 + val * 0.7})`;
                    ctx.stroke();
                }
            }
            else if (vizMode === "alien") {
                ctx.filter = "blur(18px) contrast(250%)";
                for (let i = 0; i < 10; i++) {
                    const val = dataArray[i * 15] / 255;
                    const x = (cw/2) + Math.cos(t * 0.5 + i) * (cw/3.5) * (1 + beatRef.current * 0.5);
                    const y = (ch/2) + Math.sin(t * 0.8 + i) * (ch/3.5);
                    ctx.beginPath();
                    ctx.arc(x, y, 15 + val * 60, 0, Math.PI * 2);
                    ctx.fillStyle = i % 2 === 0 ? "#e024c3" : "#6333ff";
                    ctx.fill();
                }
                ctx.filter = "none";
            }
            else if (vizMode === "cybergrid") {
                ctx.strokeStyle = "#e024c3";
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.2 + beatRef.current * 0.5;
                for (let y = 0; y < ch; y += 15) {
                    const offset = Math.sin(t + y * 0.05) * beatRef.current * 25;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(cw, y + offset);
                    ctx.stroke();
                }
                for (let x = -cw; x < cw * 2; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(cw/2 + (x - cw/2) * 0.1, 0);
                    ctx.lineTo(x, ch);
                    ctx.stroke();
                }
            }
            else if (vizMode === "prismrain") {
                particles.forEach(p => {
                    p.y += p.v * (1 + beatRef.current * 3);
                    if (p.y > ch) {
                        p.y = -20;
                        p.x = Math.random() * cw;
                    }
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = 0.7;
                    ctx.fillRect(p.x, p.y, 2, p.size * 6);
                });
            }
            // Performance tracking removed for stability
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [currentTrack?.audioUrl, vizMode, analyserRef]);

    /* ─── Actions ─── */
    /* ─── Rhythm & Flow (Beat Sync) ─── */
    const [beatIntensity, setBeatIntensity] = useState(0);
    const beatRef = useRef(0);

    /* ─── Actions ─── */
    const togglePlay = useCallback(() => setIsPlaying(!isPlaying), [isPlaying, setIsPlaying]);

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !localDuration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * localDuration;
    };

    const retry = () => {
        if (!audioRef.current || !currentTrack) return;
        setError(null);
        setIsLoading(true);
        currentSrcRef.current = "";  // Force reload
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch(() => { });
    };

    const cycleRepeat = () => {
        const modes: Array<"none" | "one" | "all"> = ["none", "all", "one"];
        const idx = modes.indexOf(repeatMode);
        setRepeatMode(modes[(idx + 1) % modes.length]);
    };


    /* ─── Minimized strip ─── */
    if (minimized) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-muse-border/50 h-10 flex items-center px-4 gap-3">
                <button onClick={() => setMinimized(false)} className="text-muse-text-muted hover:text-muse-text transition p-1" aria-label="Expand player">
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={togglePlay} disabled={!currentTrack} className="text-muse-text-muted hover:text-muse-text disabled:opacity-30 transition" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <p className="text-xs text-muse-text truncate flex-1">
                    {currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : "No track playing"}
                </p>
                <div className="w-32 h-1 bg-muse-border rounded-full hidden sm:block">
                    <div className="h-full bg-muse-primary rounded-full" style={{ width: localDuration ? `${(localTime / localDuration) * 100}%` : "0%" }} />
                </div>
                <span className="text-[10px] font-mono text-muse-text-muted hidden sm:block">{formatTime(localTime)}</span>
            </div>
        );
    }

    /* ─── Full render ─── */
    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-muse-border/50 overflow-hidden">
                {/* Background Mesh Gradient that reacts to beat */}
                <div 
                    className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-300"
                    style={{ 
                        background: `radial-gradient(circle at center, #e024c3 0%, transparent 70%)`,
                        transform: `scale(${1 + beatIntensity * 2}) translateX(${Math.sin(localTime) * 20}px)`,
                    }} 
                />
                
                <canvas ref={canvasRef} width={800} height={80} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />

                {error && (
                    <div className="absolute top-0 left-0 right-0 -translate-y-full bg-muse-danger text-white flex items-center justify-between px-4 py-1.5 text-xs z-10">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={retry} className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition text-[10px] font-medium text-white">Retry</button>
                            <button onClick={() => setError(null)} className="hover:bg-white/20 px-1.5 py-0.5 rounded transition text-[10px] text-white">✕</button>
                        </div>
                    </div>
                )}

                <div className="relative flex items-center h-20 px-4 lg:px-6 gap-4">
                    <button onClick={() => setMinimized(true)} className="text-muse-text-muted hover:text-muse-text transition p-1 -ml-1 mr-1" aria-label="Minimize player">
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Track info */}
                    <div className="flex items-center gap-3 w-[180px] lg:w-[260px] flex-shrink-0">
                        <div 
                            className={`w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-muse-primary/30 to-muse-secondary/30 flex items-center justify-center flex-shrink-0 relative transition-transform duration-75`}
                            style={{ transform: `scale(${1 + beatIntensity * 0.1})` }}
                        >
                            {currentTrack?.artwork ? (
                                <Image 
                                    src={currentTrack.artwork} 
                                    alt="" 
                                    fill 
                                    className="object-cover"
                                    sizes="48px"
                                />
                            ) : (
                                <span className="text-lg">🎵</span>
                            )}
                            {isLoading && (
                                <div className="absolute inset-0 bg-muse-surface/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                                    <Loader2 className="w-5 h-5 text-muse-primary animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-muse-text truncate">{currentTrack?.title || "Select a track to play"}</p>
                            <p className="text-xs text-muse-text-muted truncate">
                                {isPlaying ? (
                                    <span className="inline-flex gap-0.5 items-end h-2.5 mr-1.5">
                                        {[0, 1, 2].map(i => (
                                            <span 
                                                key={i} 
                                                className="w-0.5 bg-muse-primary rounded-full animate-music-bar" 
                                                style={{ 
                                                    height: `${40 + Math.random() * 60}%`,
                                                    animationDelay: `${i * 0.1}s`,
                                                    animationDuration: `${0.4 + (1 - beatIntensity) * 0.6}s`
                                                }} 
                                            />
                                        ))}
                                    </span>
                                ) : null}
                                {currentTrack?.artist || "via Audius"}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
                        <div className="flex items-center gap-5">
                            <button onClick={toggleShuffle} className={`transition-all hover:scale-110 ${shuffleMode ? "text-muse-primary drop-shadow-glow" : "text-muse-text-muted hover:text-muse-text"}`} aria-label="Shuffle">
                                <Shuffle className="w-4 h-4" />
                            </button>
                            <button onClick={previousTrack} disabled={!currentTrack} className="text-muse-text-dim hover:text-muse-text transition-all hover:scale-110 disabled:opacity-30" aria-label="Previous track">
                                <SkipBack className="w-5 h-5" />
                            </button>
                            <button onClick={togglePlay} disabled={!currentTrack || isLoading} className="group w-11 h-11 rounded-full bg-muse-primary flex items-center justify-center hover:bg-muse-primary-light transition-all hover:scale-105 active:scale-95 hover:shadow-glow-pink disabled:opacity-50" aria-label={isPlaying ? "Pause" : "Play"}>
                                {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                            </button>
                            <button onClick={nextTrack} disabled={!currentTrack} className="text-muse-text-dim hover:text-muse-text transition-all hover:scale-110 disabled:opacity-30" aria-label="Next track">
                                <SkipForward className="w-5 h-5" />
                            </button>
                            <button onClick={cycleRepeat} className={`transition-all hover:scale-110 ${repeatMode !== "none" ? "text-muse-primary drop-shadow-glow" : "text-muse-text-muted hover:text-muse-text"}`} aria-label={`Repeat: ${repeatMode}`}>
                                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-[10px] font-mono text-muse-text-muted w-10 text-right">
                                {currentTrack?.duration === 0 ? "" : formatTime(localTime)}
                            </span>

                            {/* Progress Bar / Live Badge */}
                            <div className="flex-1 h-1.5 bg-muse-border/40 rounded-full group cursor-pointer relative overflow-hidden" onClick={currentTrack?.duration === 0 ? undefined : seek}>
                                {currentTrack?.duration === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-full w-full bg-red-500/20 rounded-full animate-pulse flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-red-500 tracking-widest uppercase">LIVE BROADCAST</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-y-0 left-0 bg-white/5 rounded-full transition-all" style={{ width: `${bufferPct}%` }} />
                                        <div 
                                            className="h-full bg-gradient-to-r from-muse-primary to-muse-primary-light rounded-full relative transition-all" 
                                            style={{ 
                                                width: localDuration ? `${(localTime / localDuration) * 100}%` : "0%",
                                                boxShadow: beatIntensity > 0.6 ? `0 0 ${beatIntensity * 10}px #e024c3` : 'none'
                                            }} 
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-glow-pink" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <span className="text-[10px] font-mono text-muse-text-muted w-10">
                                {currentTrack?.duration === 0 ? "LIVE" : formatTime(localDuration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume + Settings + Expand */}
                    <div className="hidden md:flex items-center gap-3 w-[200px] flex-shrink-0 justify-end">
                        <PlayerControlsDropdown />
                        <button onClick={() => setExpanded(true)} className="text-muse-text-muted hover:text-muse-primary transition-all hover:scale-110" aria-label="Expand player" title="Expand player">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 group/volume">
                             <button onClick={() => setMuted(!muted)} className="text-muse-text-muted hover:text-muse-text transition-colors" aria-label={muted ? "Unmute" : "Mute"}>
                                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }} className="w-20 h-1 bg-muse-border rounded-full appearance-none cursor-pointer accent-muse-primary" aria-label="Volume" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded player pop-out */}
            {expanded && <ExpandedPlayer onClose={() => setExpanded(false)} />}
        </>
    );
}
