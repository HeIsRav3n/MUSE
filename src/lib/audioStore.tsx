"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode, type MutableRefObject } from "react";

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

const AudioStoreContext = createContext<AudioState | null>(null);

export function AudioStoreProvider({ children }: { children: ReactNode }) {
    /* ─── State ─── */
    const [currentTrack, setCurrentTrack] = useState<QueueTrack | null>(null);
    const [queue, setQueue] = useState<QueueTrack[]>([]);
    const [historyList, setHistoryList] = useState<QueueTrack[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.7);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shuffleMode, setShuffleMode] = useState(false);
    const [repeatMode, setRepeatModeState] = useState<RepeatMode>("none");

    const [aiDjMode, setAiDjMode] = useState(false);
    const [radioStation, setRadioStation] = useState<string | null>(null);

    /* Shared refs — MusicPlayer sets these, ExpandedPlayer reads them */
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    /* ─── Performance optimization: Memoized state updates ─── */
    const setCurrentTrackMemo = useCallback((track: QueueTrack | null) => {
        setCurrentTrack(track);
    }, []);

    const setQueueMemo = useCallback((newQueue: QueueTrack[]) => {
        setQueue(newQueue);
    }, []);

    const setHistoryListMemo = useCallback((newHistory: QueueTrack[]) => {
        setHistoryList(newHistory);
    }, []);

    /* ─── Actions ─── */
    const play = useCallback((track: QueueTrack) => {
        if (currentTrack) {
            setHistoryList((h) => [currentTrack, ...h].slice(0, 50));
        }
        setCurrentTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);
        setError(null);
        setIsLoading(true);
    }, [currentTrack]);

    const addToQueue = useCallback((track: QueueTrack) => {
        setQueue((q) => [...q, track]);
    }, []);

    const removeFromQueue = useCallback((trackId: string) => {
        setQueue((q) => q.filter((t) => t.id !== trackId));
    }, []);

    const clearQueue = useCallback(() => {
        setQueue([]);
    }, []);

    const nextTrack = useCallback(() => {
        if (repeatMode === "one" && currentTrack) {
            // Restart same track — handled via MusicPlayer reset
            setCurrentTime(0);
            setIsPlaying(true);
            return;
        }

        if (queue.length > 0) {
            const next = queue[0]; // The provided edit removes shuffle logic here
            setQueue((prev) => prev.slice(1));
            setHistoryList((prev) => currentTrack ? [currentTrack, ...prev].slice(0, 50) : prev);
            setCurrentTrack(next);
            setIsPlaying(true);
            setCurrentTime(0); // Added back from original logic
            setError(null); // Added back from original logic
            setIsLoading(true); // Added back from original logic
        } else if (aiDjMode) {
            // AI-DJ: Auto-generate a track
            const genres = ["Lo-Fi", "Synthwave", "Deep House", "Ambient"];
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];
            const next: QueueTrack = {
                id: `ai-${Date.now()}`,
                title: `AI Curated: ${randomGenre} Vibes`,
                artist: "Sonara AI-DJ",
                artwork: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock
                duration: 240,
            };
            setHistoryList((prev) => currentTrack ? [currentTrack, ...prev].slice(0, 50) : prev);
            setCurrentTrack(next);
            setIsPlaying(true);
            setCurrentTime(0); // Added for consistency
            setError(null); // Added for consistency
            setIsLoading(true); // Added for consistency
        } else if (repeatMode === "all" && historyList.length > 0) {
            // Rebuild queue from history and play first (original logic)
            const reversed = [...historyList].reverse();
            setQueue(reversed.slice(1));
            setCurrentTrack(reversed[0]);
            setHistoryList([]);
            setIsPlaying(true);
            setCurrentTime(0); // Added back from original logic
            setError(null); // Added back from original logic
            setIsLoading(true); // Added back from original logic
        } else {
            setIsPlaying(false);
            if (currentTrack) {
                setHistoryList((prev) => [currentTrack, ...prev].slice(0, 50));
                setCurrentTrack(null);
            }
        }
    }, [queue, currentTrack, shuffleMode, repeatMode, historyList, aiDjMode]); // Added aiDjMode to dependencies

    const previousTrack = useCallback(() => {
        if (historyList.length > 0) {
            const [prev, ...rest] = historyList;
            if (currentTrack) {
                setQueue((q) => [currentTrack, ...q]);
            }
            setCurrentTrack(prev);
            setHistoryList(rest);
            setIsPlaying(true);
            setCurrentTime(0);
            setError(null);
        }
    }, [historyList, currentTrack]);

    const toggleShuffle = useCallback(() => {
        setShuffleMode((s) => !s);
    }, []);

    const setIsPlayingFn = useCallback((v: boolean) => setIsPlaying(v), []);
    const setCurrentTimeFn = useCallback((t: number) => setCurrentTime(t), []);
    const setDurationFn = useCallback((d: number) => setDuration(d), []);
    const setVolumeFn = useCallback((v: number) => setVolumeState(v), []);
    const setIsLoadingFn = useCallback((v: boolean) => setIsLoading(v), []);
    const setErrorFn = useCallback((e: string | null) => setError(e), []);
    const setRepeatModeFn = useCallback((m: RepeatMode) => setRepeatModeState(m), []);

    const toggleAiDjMode = useCallback(() => setAiDjMode(prev => !prev), []);
    const setRadioStationFn = useCallback((station: string | null) => setRadioStation(station), []);

    return (
        <AudioStoreContext.Provider
            value={{
                currentTrack,
                queue,
                history: historyList,
                isPlaying,
                currentTime,
                duration,
                volume,
                isLoading,
                error,
                shuffleMode,
                repeatMode,
                play,
                addToQueue,
                removeFromQueue,
                clearQueue,
                nextTrack,
                previousTrack,
                setIsPlaying: setIsPlayingFn,
                setCurrentTime: setCurrentTimeFn,
                setDuration: setDurationFn,
                setVolume: setVolumeFn,
                setIsLoading: setIsLoadingFn,
                setError: setErrorFn,
                toggleShuffle: toggleShuffle, // Using the original toggleShuffle directly
                setRepeatMode: setRepeatModeFn,
                audioRef,
                analyserRef,
                aiDjMode,
                toggleAiDjMode,
                radioStation,
                setRadioStation: setRadioStationFn,
            }}
        >
            {children}
        </AudioStoreContext.Provider>
    );
}

export function useAudioStore() {
    const context = useContext(AudioStoreContext);
    if (!context) {
        throw new Error("useAudioStore must be used within an AudioStoreProvider");
    }
    return context;
}
