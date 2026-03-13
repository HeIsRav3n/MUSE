"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode, type MutableRefObject, useEffect } from "react";
import { getTrendingTracks, getStreamUrl } from "@/lib/audius";

export interface QueueTrack {
    id: string;
    title: string;
    artist: string;
    artwork?: string;
    audioUrl: string;
    duration: number;
}

type RepeatMode = "none" | "one" | "all";

interface AudioState {
    /* Track state */
    currentTrack: QueueTrack | null;
    queue: QueueTrack[];
    history: QueueTrack[];

    /* Playback state */
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isLoading: boolean;
    error: string | null;
    shuffleMode: boolean;
    repeatMode: RepeatMode;

    /* Actions */
    play: (track: QueueTrack) => void;
    addToQueue: (track: QueueTrack) => void;
    removeFromQueue: (trackId: string) => void;
    clearQueue: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setIsPlaying: (v: boolean) => void;
    setCurrentTime: (t: number) => void;
    setDuration: (d: number) => void;
    setVolume: (v: number) => void;
    setIsLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    toggleShuffle: () => void;
    setRepeatMode: (m: RepeatMode) => void;
    /* Shared refs for audio element and analyser */
    audioRef: MutableRefObject<HTMLAudioElement | null>;
    analyserRef: MutableRefObject<AnalyserNode | null>;

    /* AI-DJ & Radio */
    aiDjMode: boolean;
    toggleAiDjMode: () => void;
    radioStation: string | null;
    setRadioStation: (station: string | null) => void;
}

const defaults: AudioState = {
    currentTrack: null,
    queue: [],
    history: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null,
    shuffleMode: false,
    repeatMode: "none",
    play: () => { },
    addToQueue: () => { },
    removeFromQueue: () => { },
    clearQueue: () => { },
    nextTrack: () => { },
    previousTrack: () => { },
    setIsPlaying: () => { },
    setCurrentTime: () => { },
    setDuration: () => { },
    setVolume: () => { },
    setIsLoading: () => { },
    setError: () => { },
    toggleShuffle: () => { },
    setRepeatMode: () => { },
    audioRef: { current: null },
    analyserRef: { current: null },
    aiDjMode: false,
    toggleAiDjMode: () => { },
    radioStation: null,
    setRadioStation: () => { },
};

/* ─── Contexts ─── */
interface AudioDataContext {
    currentTrack: QueueTrack | null;
    queue: QueueTrack[];
    history: QueueTrack[];
    isLoading: boolean;
    error: string | null;
    shuffleMode: boolean;
    repeatMode: RepeatMode;
    aiDjMode: boolean;
    radioStation: string | null;
    
    /* Actions */
    play: (track: QueueTrack) => void;
    addToQueue: (track: QueueTrack) => void;
    removeFromQueue: (trackId: string) => void;
    clearQueue: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    toggleShuffle: () => void;
    setRepeatMode: (m: RepeatMode) => void;
    toggleAiDjMode: () => void;
    setRadioStation: (station: string | null) => void;
    setIsLoading: (v: boolean) => void;
    setError: (e: string | null) => void;

    /* Shared refs */
    audioRef: MutableRefObject<HTMLAudioElement | null>;
    analyserRef: MutableRefObject<AnalyserNode | null>;
}

interface AudioPlaybackContext {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    setIsPlaying: (v: boolean) => void;
    setCurrentTime: (t: number) => void;
    setDuration: (d: number) => void;
    setVolume: (v: number) => void;
}

const AudioDataContext = createContext<AudioDataContext | null>(null);
const AudioPlaybackContext = createContext<AudioPlaybackContext | null>(null);

export function AudioStoreProvider({ children }: { children: ReactNode }) {
    /* ─── Stable Data State ─── */
    const [currentTrack, setCurrentTrack] = useState<QueueTrack | null>(null);
    const [queue, setQueue] = useState<QueueTrack[]>([]);
    const [historyList, setHistoryList] = useState<QueueTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shuffleMode, setShuffleMode] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
    const [aiDjMode, setAiDjMode] = useState(false);
    const [radioStation, setRadioStation] = useState<string | null>(null);

    /* ─── High-Frequency Playback State ─── */
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);

    /* Refs */
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    /* Actions (Stable) */
    const play = useCallback((track: QueueTrack) => {
        if (!track.id || track.id === 'undefined') return;
        
        // Use functional set to avoid depending on currentTrack directly in the callback
        setCurrentTrack((prev) => {
            if (prev && prev.id !== track.id) {
                setHistoryList((h) => [prev, ...h].slice(0, 50));
            }
            return track;
        });
        
        setIsPlaying(true);
        setCurrentTime(0);
        setError(null);
        setIsLoading(true);
    }, []); // dependency-free!

    const addToQueue = useCallback((track: QueueTrack) => setQueue((q) => [...q, track]), []);
    const removeFromQueue = useCallback((trackId: string) => setQueue((q) => q.filter((t) => t.id !== trackId)), []);
    const clearQueue = useCallback(() => setQueue([]), []);

    const nextTrack = useCallback(() => {
        if (repeatMode === "one" && currentTrack) {
            setCurrentTime(0);
            setIsPlaying(true);
            return;
        }

        if (queue.length > 0) {
            const next = queue[0];
            setQueue((prev) => prev.slice(1));
            setHistoryList((prev) => currentTrack ? [currentTrack, ...prev].slice(0, 50) : prev);
            setCurrentTrack(next);
            setIsPlaying(true);
            setCurrentTime(0);
            setError(null);
            setIsLoading(true);
        } else if (aiDjMode) {
            (async () => {
                try {
                    const trending = await getTrendingTracks(10);
                    if (trending.length > 0) {
                        const randomTrack = trending[Math.floor(Math.random() * trending.length)];
                        const next: QueueTrack = {
                            id: randomTrack.id,
                            title: randomTrack.title,
                            artist: randomTrack.user.name,
                            artwork: randomTrack.artwork?.['480x480'] || randomTrack.artwork?.['150x150'] || "",
                            audioUrl: getStreamUrl(randomTrack.id),
                            duration: randomTrack.duration,
                        };
                        setHistoryList((prev) => currentTrack ? [currentTrack, ...prev].slice(0, 50) : prev);
                        setCurrentTrack(next);
                        setIsPlaying(true);
                        setCurrentTime(0);
                        setError(null);
                        setIsLoading(true);
                    }
                } catch (err) {
                    setError("AI-DJ error");
                    setAiDjMode(false);
                }
            })();
        } else if (repeatMode === "all" && historyList.length > 0) {
            const reversed = [...historyList].reverse();
            setQueue(reversed.slice(1));
            setCurrentTrack(reversed[0]);
            setHistoryList([]);
            setIsPlaying(true);
            setCurrentTime(0);
            setError(null);
            setIsLoading(true);
        } else {
            setIsPlaying(false);
            if (currentTrack) {
                setHistoryList((prev) => [currentTrack, ...prev].slice(0, 50));
                setCurrentTrack(null);
            }
        }
    }, [queue, currentTrack, repeatMode, historyList, aiDjMode]);

    const previousTrack = useCallback(() => {
        if (historyList.length > 0) {
            const [prev, ...rest] = historyList;
            if (currentTrack) setQueue((q) => [currentTrack, ...q]);
            setCurrentTrack(prev);
            setHistoryList(rest);
            setIsPlaying(true);
            setCurrentTime(0);
            setError(null);
        }
    }, [historyList, currentTrack]);

    const toggleShuffle = useCallback(() => setShuffleMode((s) => !s), []);
    const setRepeatModeFn = useCallback((m: RepeatMode) => setRepeatMode(m), []);
    const toggleAiDjMode = useCallback(() => setAiDjMode(prev => !prev), []);
    const setRadioStationFn = useCallback((station: string | null) => setRadioStation(station), []);
    const setIsLoadingFn = useCallback((v: boolean) => setIsLoading(v), []);
    const setErrorFn = useCallback((e: string | null) => setError(e), []);

    /* High-Frequency Actions */
    const setIsPlayingFn = useCallback((v: boolean) => setIsPlaying(v), []);
    const setCurrentTimeFn = useCallback((t: number) => setCurrentTime(t), []);
    const setDurationFn = useCallback((d: number) => setDuration(d), []);
    const setVolumeFn = useCallback((v: number) => setVolume(v), []);

    return (
        <AudioDataContext.Provider
            value={{
                currentTrack, queue, history: historyList, isLoading, error, 
                shuffleMode, repeatMode, aiDjMode, radioStation,
                play, addToQueue, removeFromQueue, clearQueue, nextTrack, previousTrack, 
                toggleShuffle, setRepeatMode: setRepeatModeFn, toggleAiDjMode, 
                setRadioStation: setRadioStationFn, setIsLoading: setIsLoadingFn, setError: setErrorFn,
                audioRef, analyserRef
            }}
        >
            <AudioPlaybackContext.Provider
                value={{
                    isPlaying, currentTime, duration, volume,
                    setIsPlaying: setIsPlayingFn, setCurrentTime: setCurrentTimeFn, 
                    setDuration: setDurationFn, setVolume: setVolumeFn
                }}
            >
                {children}
            </AudioPlaybackContext.Provider>
        </AudioDataContext.Provider>
    );
}

export function useAudioData() {
    const context = useContext(AudioDataContext);
    if (!context) throw new Error("useAudioData must be used within AudioStoreProvider");
    return context;
}

export function useAudioPlayback() {
    const context = useContext(AudioPlaybackContext);
    if (!context) throw new Error("useAudioPlayback must be used within AudioStoreProvider");
    return context;
}
