"use client";

import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Repeat, Repeat1, Shuffle, Loader2, AlertCircle,
    ChevronDown, ChevronUp, Maximize2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAudioStore } from "@/lib/audioStore";
import { handleAudioError, handleNetworkError } from "@/lib/errorHandler";
import { trackAudioPerformance, trackComponentPerformance } from "@/lib/performanceMonitor";
import { PlayerControlsDropdown } from "./PlayerControlsDropdown";
import { ExpandedPlayer } from "./ExpandedPlayer";

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
        queue, // Added for AI-DJ logic
        isPlaying,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        setIsLoading,
        setError,
        isLoading,
        error,
        volume,
        setVolume,
        shuffleMode,
        repeatMode,
        toggleShuffle,
        setRepeatMode,
        nextTrack,
        previousTrack,
        audioRef,
        analyserRef,
        aiDjMode, // Added
    } = useAudioStore();

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
                if (queue.length === 0 && (window as any).sonaraAiDjMode) {
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
    const [vizMode, setVizMode] = useState<string>(() => {
        if (typeof window !== "undefined") return localStorage.getItem("sonara_viz_mode") || "waveform";
        return "waveform";
    });

    useEffect(() => {
        const handler = (e: Event) => {
            const mode = (e as CustomEvent).detail?.mode;
            if (mode) setVizMode(mode);
        };
        window.addEventListener("sonara-viz-mode", handler);
        return () => window.removeEventListener("sonara-viz-mode", handler);
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

        // Performance optimizations
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let lastFrameTime = 0;
        const targetFPS = 30; // Limit frame rate to reduce CPU usage
        const frameInterval = 1000 / targetFPS;
        
        // Pre-calculate constants
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Pre-create gradients (only once per mode change)
        let waveformGrad: CanvasGradient | null = null;
        let alienBlobGrad: CanvasGradient | null = null;
        
        if (vizMode === "waveform") {
            waveformGrad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
            waveformGrad.addColorStop(0, "#a855f7");
            waveformGrad.addColorStop(0.5, "#d946ef");
            waveformGrad.addColorStop(1, "#f0abfc");
        } else if (vizMode === "alien") {
            alienBlobGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(canvasWidth, canvasHeight) * 0.25);
            alienBlobGrad.addColorStop(0, "rgba(139, 92, 246, 0.6)");
            alienBlobGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.3)");
            alienBlobGrad.addColorStop(1, "rgba(217, 70, 239, 0.1)");
        }

        let t = 0;
        let animationId = 0;
        
        const draw = (currentTime: number) => {
            animationId = requestAnimationFrame(draw);
            
            // Frame rate limiting
            if (currentTime - lastFrameTime < frameInterval) return;
            lastFrameTime = currentTime;
            
            // Track animation frame performance
            const frameStart = performance.now();
            
            t += 0.016;
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            if (vizMode === "waveform") {
                /* ─ Optimized waveform ─ */
                const barCount = Math.min(dataArray.length, canvasWidth / 2); // Reduce bars for performance
                const barWidth = canvasWidth / barCount;
                
                ctx.fillStyle = waveformGrad!;
                ctx.globalAlpha = 0.75;
                
                for (let i = 0; i < barCount; i++) {
                    const height = (dataArray[i] / 255) * canvasHeight;
                    ctx.fillRect(i * barWidth, canvasHeight - height, barWidth - 1, height);
                }
                ctx.globalAlpha = 1;

            } else if (vizMode === "strings") {
                /* ─ Optimized flowing strings ─ */
                const lineCount = 4; // Reduced from 6 for performance
                const stepSize = Math.max(2, Math.floor(canvasWidth / 100)); // Adaptive step size
                
                for (let l = 0; l < lineCount; l++) {
                    ctx.beginPath();
                    const hue = 270 + l * 15;
                    ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${0.3 + (l / lineCount) * 0.4})`;
                    ctx.lineWidth = 1.5;
                    
                    let firstPoint = true;
                    for (let x = 0; x < canvasWidth; x += stepSize) {
                        const dataIndex = Math.floor((x / canvasWidth) * dataArray.length);
                        const value = (dataArray[dataIndex] || 0) / 255;
                        const baseY = canvasHeight / 2;
                        const amplitude = value * canvasHeight * 0.4;
                        const frequency = 0.02 + l * 0.008;
                        const phase = t * (2 + l * 0.5) + l * Math.PI * 0.3;
                        const y = baseY + Math.sin(x * frequency + phase) * amplitude;
                        
                        if (firstPoint) {
                            ctx.moveTo(x, y);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }

            } else if (vizMode === "alien") {
                /* ─ Optimized alien blob ─ */
                const baseRadius = Math.min(canvasWidth, canvasHeight) * 0.25;
                
                // Blob body (reduced segments)
                const segments = 32; // Reduced from 64 for performance
                ctx.beginPath();
                for (let i = 0; i <= segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    const dataIndex = Math.floor((i / segments) * dataArray.length);
                    const value = (dataArray[dataIndex] || 0) / 255;
                    const radius = baseRadius * (0.3 + value * 0.7) + 
                                  Math.sin(angle * 5 + t * 3) * 8 + 
                                  Math.cos(angle * 3 + t * 2) * 6;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fillStyle = alienBlobGrad!;
                ctx.fill();
                ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Tentacles (reduced count)
                const tentacleCount = 6; // Reduced from 8 for performance
                for (let i = 0; i < tentacleCount; i++) {
                    const angle = (i / tentacleCount) * Math.PI * 2 + t * 0.3;
                    const dataIndex = Math.floor((i / tentacleCount) * dataArray.length);
                    const value = (dataArray[dataIndex] || 0) / 255;
                    const length = baseRadius * 0.5 + value * baseRadius * 0.8;
                    
                    ctx.beginPath();
                    const startX = centerX + Math.cos(angle) * baseRadius * 0.3;
                    const startY = centerY + Math.sin(angle) * baseRadius * 0.3;
                    const endX = centerX + Math.cos(angle + Math.sin(t * 2 + i) * 0.3) * length;
                    const endY = centerY + Math.sin(angle + Math.cos(t * 2 + i) * 0.3) * length;
                    const controlX = centerX + Math.cos(angle + 0.5) * length * 0.6 + Math.sin(t * 3 + i) * 15;
                    const controlY = centerY + Math.sin(angle + 0.5) * length * 0.6 + Math.cos(t * 3 + i) * 15;
                    
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                    ctx.strokeStyle = `hsla(${280 + i * 12}, 80%, 65%, ${0.2 + value * 0.4})`;
                    ctx.lineWidth = 2 + value * 2;
                    ctx.stroke();

                    // Dot at tip
                    ctx.beginPath();
                    ctx.arc(endX, endY, 2 + value * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${280 + i * 12}, 80%, 70%, ${0.5 + value * 0.5})`;
                    ctx.fill();
                }
            }
            
            // Track animation frame time
            const frameTime = performance.now() - frameStart;
            trackAudioPerformance('animation_frame', frameTime, {
                vizMode: vizMode,
                fps: Math.round(1000 / frameTime)
            });
        };
        
        animationId = requestAnimationFrame(draw);
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [currentTrack?.audioUrl, vizMode, analyserRef]);

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
            <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-sonara-border/50 h-10 flex items-center px-4 gap-3">
                <button onClick={() => setMinimized(false)} className="text-sonara-text-muted hover:text-sonara-text transition p-1" aria-label="Expand player">
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={togglePlay} disabled={!currentTrack} className="text-sonara-text-muted hover:text-sonara-text disabled:opacity-30 transition" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <p className="text-xs text-sonara-text truncate flex-1">
                    {currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : "No track playing"}
                </p>
                <div className="w-32 h-1 bg-sonara-border rounded-full hidden sm:block">
                    <div className="h-full bg-sonara-primary rounded-full" style={{ width: localDuration ? `${(localTime / localDuration) * 100}%` : "0%" }} />
                </div>
                <span className="text-[10px] font-mono text-sonara-text-muted hidden sm:block">{formatTime(localTime)}</span>
            </div>
        );
    }

    /* ─── Full render ─── */
    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-sonara-border/50">
                <canvas ref={canvasRef} width={800} height={40} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />

                {error && (
                    <div className="absolute top-0 left-0 right-0 -translate-y-full bg-red-500/90 backdrop-blur text-white flex items-center justify-between px-4 py-1.5 text-xs z-10">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={retry} className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full transition text-[10px] font-medium">Retry</button>
                            <button onClick={() => setError(null)} className="hover:bg-white/20 px-1.5 py-0.5 rounded transition text-[10px]">✕</button>
                        </div>
                    </div>
                )}

                <div className="relative flex items-center h-20 px-4 lg:px-6 gap-4">
                    <button onClick={() => setMinimized(true)} className="text-sonara-text-muted hover:text-sonara-text transition p-1 -ml-1 mr-1" aria-label="Minimize player">
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Track info */}
                    <div className="flex items-center gap-3 w-[180px] lg:w-[260px] flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-sonara-primary/30 to-sonara-secondary/30 flex items-center justify-center flex-shrink-0 relative">
                            {currentTrack?.artwork ? (
                                <img src={currentTrack.artwork} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg">🎵</span>
                            )}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-sonara-text truncate">{currentTrack?.title || "Select a track to play"}</p>
                            <p className="text-xs text-sonara-text-muted truncate">{currentTrack?.artist || "via Audius"}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
                        <div className="flex items-center gap-4">
                            <button onClick={toggleShuffle} className={`transition-colors ${shuffleMode ? "text-sonara-primary" : "text-sonara-text-muted hover:text-sonara-text"}`} aria-label="Shuffle">
                                <Shuffle className="w-4 h-4" />
                            </button>
                            <button onClick={previousTrack} disabled={!currentTrack} className="text-sonara-text-dim hover:text-sonara-text transition-colors disabled:opacity-30" aria-label="Previous track">
                                <SkipBack className="w-5 h-5" />
                            </button>
                            <button onClick={togglePlay} disabled={!currentTrack || isLoading} className="w-10 h-10 rounded-full bg-sonara-primary flex items-center justify-center hover:bg-sonara-primary-light transition-colors hover:shadow-glow disabled:opacity-50" aria-label={isPlaying ? "Pause" : "Play"}>
                                {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                            </button>
                            <button onClick={nextTrack} disabled={!currentTrack} className="text-sonara-text-dim hover:text-sonara-text transition-colors disabled:opacity-30" aria-label="Next track">
                                <SkipForward className="w-5 h-5" />
                            </button>
                            <button onClick={cycleRepeat} className={`transition-colors ${repeatMode !== "none" ? "text-sonara-primary" : "text-sonara-text-muted hover:text-sonara-text"}`} aria-label={`Repeat: ${repeatMode}`}>
                                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-[10px] font-mono text-sonara-text-muted w-8 text-right">
                                {currentTrack?.duration === 0 ? "" : formatTime(localTime)}
                            </span>

                            {/* Progress Bar / Live Badge */}
                            <div className="flex-1 h-1.5 bg-sonara-border rounded-full group cursor-pointer relative" onClick={currentTrack?.duration === 0 ? undefined : seek}>
                                {currentTrack?.duration === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-full w-full bg-red-500/20 rounded-full animate-pulse flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-red-500 tracking-widest uppercase">LIVE BROADCAST</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-y-0 left-0 bg-sonara-text-muted/20 rounded-full transition-all" style={{ width: `${bufferPct}%` }} />
                                        <div className="h-full bg-sonara-primary rounded-full relative group-hover:bg-sonara-primary-light transition-colors" style={{ width: localDuration ? `${(localTime / localDuration) * 100}%` : "0%" }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-glow" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <span className="text-[10px] font-mono text-sonara-text-muted w-8">
                                {currentTrack?.duration === 0 ? "LIVE" : formatTime(localDuration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume + Settings + Expand */}
                    <div className="hidden md:flex items-center gap-2 w-[200px] flex-shrink-0 justify-end">
                        <PlayerControlsDropdown />
                        <button onClick={() => setExpanded(true)} className="text-sonara-text-muted hover:text-sonara-primary transition-colors" aria-label="Expand player" title="Expand player">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setMuted(!muted)} className="text-sonara-text-muted hover:text-sonara-text transition-colors" aria-label={muted ? "Unmute" : "Mute"}>
                            {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }} className="w-20 h-1 bg-sonara-border rounded-full appearance-none cursor-pointer accent-sonara-primary" aria-label="Volume" />
                    </div>
                </div>
            </div>

            {/* Expanded player pop-out */}
            {expanded && <ExpandedPlayer onClose={() => setExpanded(false)} />}
        </>
    );
}
