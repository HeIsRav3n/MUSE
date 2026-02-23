"use client";

import { Repeat, Repeat1, Shuffle, Settings, Waves, Zap, Sparkles } from "lucide-react";
import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from "@/components/ui/Dropdown";
import { useAudioStore } from "@/lib/audioStore";
import { useState, useEffect } from "react";

const speedOptions = [
    { label: "0.5×", value: 0.5 },
    { label: "0.75×", value: 0.75 },
    { label: "1×", value: 1 },
    { label: "1.25×", value: 1.25 },
    { label: "1.5×", value: 1.5 },
    { label: "2×", value: 2 },
];

export type VisualizerMode = "waveform" | "strings" | "alien" | "off";

const vizOptions: { key: VisualizerMode; label: string; icon: React.ReactNode }[] = [
    { key: "waveform", label: "Waveform", icon: <Waves className="w-3.5 h-3.5" /> },
    { key: "strings", label: "Strings", icon: <Zap className="w-3.5 h-3.5" /> },
    { key: "alien", label: "Alien", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "off", label: "Off", icon: null },
];

export function PlayerControlsDropdown() {
    const { shuffleMode, repeatMode, toggleShuffle, setRepeatMode, audioRef, aiDjMode, toggleAiDjMode } = useAudioStore();
    const [speed, setSpeed] = useState(1);
    const [vizMode, setVizMode] = useState<VisualizerMode>("waveform");

    // Load saved viz mode
    useEffect(() => {
        const saved = localStorage.getItem("sonara_viz_mode") as VisualizerMode;
        if (saved) setVizMode(saved);
    }, []);

    const changeSpeed = (value: number) => {
        setSpeed(value);
        const audio = audioRef.current;
        if (audio) audio.playbackRate = value;
    };

    const changeVizMode = (mode: VisualizerMode) => {
        setVizMode(mode);
        localStorage.setItem("sonara_viz_mode", mode);
        window.dispatchEvent(new CustomEvent("sonara-viz-mode", { detail: { mode } }));
    };

    const cycleRepeat = () => {
        const modes: Array<"none" | "one" | "all"> = ["none", "all", "one"];
        const idx = modes.indexOf(repeatMode);
        setRepeatMode(modes[(idx + 1) % modes.length]);
    };

    const repeatIcon = repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />;
    const repeatLabel = repeatMode === "none" ? "Off" : repeatMode === "one" ? "Track" : "All";

    return (
        <Dropdown
            trigger={
                <button className="text-sonara-text-muted hover:text-sonara-text transition-colors p-1 rounded-lg hover:bg-white/5" aria-label="Player settings">
                    <Settings className="w-4 h-4" />
                </button>
            }
            position="top-right"
            offset={12}
            menuClassName="w-56"
            closeOnClick={false}
        >
            <DropdownHeader>Playback</DropdownHeader>

            <DropdownItem icon={<Zap className="w-4 h-4" />} onClick={toggleAiDjMode} preventClose>
                <div className="flex items-center justify-between w-full">
                    <span className={aiDjMode ? "text-sonara-primary-light font-bold" : ""}>AI-DJ Mode</span>
                    {aiDjMode && <span className="w-2 h-2 rounded-full bg-sonara-primary animate-pulse" />}
                </div>
            </DropdownItem>

            <DropdownItem icon={repeatIcon} onClick={cycleRepeat} preventClose>
                <div className="flex items-center justify-between w-full">
                    <span>Repeat</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${repeatMode !== "none" ? "bg-sonara-primary/20 text-sonara-primary-light" : "text-sonara-text-muted"}`}>
                        {repeatLabel}
                    </span>
                </div>
            </DropdownItem>

            <DropdownItem icon={<Shuffle className="w-4 h-4" />} onClick={toggleShuffle} preventClose>
                <div className="flex items-center justify-between w-full">
                    <span>Shuffle</span>
                    {shuffleMode && <span className="w-2 h-2 rounded-full bg-sonara-primary animate-pulse" />}
                </div>
            </DropdownItem>

            <DropdownDivider />
            <DropdownHeader>Speed</DropdownHeader>

            <div className="grid grid-cols-3 gap-1 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                {speedOptions.map((s) => (
                    <button
                        key={s.label}
                        onClick={() => changeSpeed(s.value)}
                        className={`px-2 py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${speed === s.value
                            ? "bg-sonara-primary/20 text-sonara-primary-light ring-1 ring-sonara-primary/30"
                            : "text-sonara-text-dim hover:bg-white/5 hover:text-sonara-text"
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <DropdownDivider />
            <DropdownHeader>Visualizer</DropdownHeader>

            <div className="px-3 py-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                {vizOptions.map((opt) => (
                    <button
                        key={opt.key}
                        onClick={() => changeVizMode(opt.key)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${vizMode === opt.key
                            ? "bg-sonara-primary/20 text-sonara-primary-light ring-1 ring-sonara-primary/30"
                            : "text-sonara-text-dim hover:bg-white/5 hover:text-sonara-text"
                            }`}
                    >
                        {opt.icon}
                        <span>{opt.label}</span>
                        {vizMode === opt.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sonara-primary" />}
                    </button>
                ))}
            </div>
        </Dropdown>
    );
}
