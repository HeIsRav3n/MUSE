"use client";

import { useState, useCallback } from "react";
import { Music } from "lucide-react";

/**
 * Audius artwork object shape from the API.
 * Per OAP spec: always preserve `mirrors` — never flatten to a single URL.
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

/**
 * Size-to-variant mapping per OAP Image Loading spec:
 * Pick the variant closest to the rendered size.
 */
const SIZE_VARIANTS: Record<string, string> = {
    sm: "150x150",
    md: "480x480",
    lg: "1000x1000",
};

/**
 * Extract a URL from the artwork object using the preferred size variant.
 */
function getImageUrl(
    artwork: AudiusArtwork | Record<string, string> | undefined | null,
    size: string
): string | null {
    if (!artwork) return null;
    const variant = SIZE_VARIANTS[size] || "150x150";
    return (artwork as Record<string, string>)[variant] || (artwork as Record<string, string>)["150x150"] || null;
}

/**
 * Swap the host in a URL with a mirror host.
 * e.g. "https://audius-content-7.example.com/content/abc/150x150.jpg"
 *   → "https://cn0.mainnet.audiusindex.org/content/abc/150x150.jpg"
 */
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

/**
 * AudiusImage — shared image component with mirror retry.
 *
 * Per Open Audio Protocol docs (audius.co/skill.md):
 * - Never use raw <img> for Audius content
 * - On load failure, swap host with each mirror and retry
 * - Size-aware: pick variant closest to rendered size
 */
export function AudiusImage({ artwork, size = "sm", alt = "", className = "" }: AudiusImageProps) {
    const [mirrorIndex, setMirrorIndex] = useState(0);
    const [failed, setFailed] = useState(false);

    const baseUrl = getImageUrl(artwork, size);
    const mirrors: string[] = (artwork as AudiusArtwork)?.mirrors || [];

    // Compute the current URL (original or mirror-swapped)
    const currentUrl = !baseUrl
        ? null
        : mirrorIndex === 0
            ? baseUrl
            : mirrorIndex <= mirrors.length
                ? swapHost(baseUrl, mirrors[mirrorIndex - 1])
                : null;

    const handleError = useCallback(() => {
        if (mirrorIndex < mirrors.length) {
            // Try next mirror
            setMirrorIndex((prev) => prev + 1);
        } else {
            // All mirrors exhausted — show fallback
            setFailed(true);
        }
    }, [mirrorIndex, mirrors.length]);

    // Fallback: gradient placeholder with music icon
    if (!currentUrl || failed) {
        return (
            <div className={`flex items-center justify-center bg-[#282828] ${className}`}>
                <Music className="w-1/3 h-1/3 text-[#727272]" />
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={currentUrl}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
}
