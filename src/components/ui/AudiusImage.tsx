"use client";

import { useState, useCallback, memo } from "react";
import { Music } from "lucide-react";
import Image from "next/image";

/**
 * Audius artwork object shape from the API.
 */
export interface AudiusArtwork {
    "150x150"?: string;
    "480x480"?: string;
    "1000x1000"?: string;
    mirrors?: string[];
    [key: string]: string | string[] | undefined;
}

interface AudiusImageProps {
    artwork: AudiusArtwork | Record<string, string> | undefined | null;
    size?: "sm" | "md" | "lg";
    alt?: string;
    className?: string;
}

const SIZE_VARIANTS: Record<string, string> = {
    sm: "150x150",
    md: "480x480",
    lg: "1000x1000",
};

function getImageUrl(
    artwork: AudiusArtwork | Record<string, string> | undefined | null,
    size: string
): string | null {
    if (!artwork) return null;
    const variant = SIZE_VARIANTS[size] || "150x150";
    return (artwork as Record<string, string>)[variant] || (artwork as Record<string, string>)["150x150"] || null;
}

function swapHost(url: string, mirrorHost: string): string {
    try {
        const parsed = new URL(url);
        const mirror = new URL(mirrorHost);
        parsed.host = mirror.host;
        parsed.protocol = mirror.protocol;
        return parsed.toString();
    } catch {
        return url;
    }
}

export const AudiusImage = memo(function AudiusImage({ artwork, size = "sm", alt = "", className = "" }: AudiusImageProps) {
    const [mirrorIndex, setMirrorIndex] = useState(0);
    const [failed, setFailed] = useState(false);

    const baseUrl = getImageUrl(artwork, size);
    const mirrors: string[] = (artwork as AudiusArtwork)?.mirrors || [];

    const currentUrl = !baseUrl
        ? null
        : mirrorIndex === 0
            ? baseUrl
            : mirrorIndex <= mirrors.length
                ? swapHost(baseUrl, mirrors[mirrorIndex - 1])
                : null;

    const handleError = useCallback(() => {
        if (mirrorIndex < mirrors.length) {
            setMirrorIndex((prev) => prev + 1);
        } else {
            setFailed(true);
        }
    }, [mirrorIndex, mirrors.length]);

    if (!currentUrl || failed) {
        return (
            <div className={`flex items-center justify-center bg-[#282828] ${className}`}>
                <Music className="w-1/3 h-1/3 text-[#727272]" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Using standard img for decentralized Audius nodes to avoid Next.js RemotePattern crashes */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={currentUrl}
                alt={alt}
                className="w-full h-full object-cover"
                onError={handleError}
                loading="lazy"
            />
        </div>
    );
});
