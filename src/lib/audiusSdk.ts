// Audius SDK helpers — REST API wrapper for client-side use
// Built on the Open Audio Protocol (https://openaudio.org)
// Uses the Audius REST API directly with typed helpers

import type { AudiusArtwork } from '@/components/ui/AudiusImage';

const API_BASE = 'https://api.audius.co/v1';
const API_KEY = process.env.NEXT_PUBLIC_AUDIUS_API_KEY || '0xae4d3e296787e296b704511d724e7fac088ce029';

const apiCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 300000; // 5 minutes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function audiusFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
    let url: URL;
    try {
        url = new URL(`${API_BASE}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (k && v) url.searchParams.set(k, v);
            });
        }
    } catch (e) {
        console.error("Invalid URL in audiusFetch:", e);
        return null;
    }
    const cacheKey = url.toString();

    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }

    try {
        const res = await fetch(cacheKey, {
            headers: { 'x-api-key': API_KEY, Accept: 'application/json' },
            next: { revalidate: 300 } // Next.js level caching
        });
        if (!res.ok) return null;
        const json = await res.json();
        const data = json?.data ?? null;

        // Save to cache
        if (data) {
            apiCache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL });
        }
        return data;
    } catch {
        return null;
    }
}

// ---- Types ----

export interface SdkTrack {
    id: string;
    title: string;
    user: { id: string; name: string; handle: string; profilePicture?: AudiusArtwork };
    artwork?: AudiusArtwork;
    playCount: number;
    favoriteCount: number;
    repostCount: number;
    duration: number;
    genre: string;
    permalink: string;
}

export interface SdkUser {
    id: string;
    name: string;
    handle: string;
    bio?: string;
    profilePicture?: AudiusArtwork;
    coverPhoto?: AudiusArtwork;
    followerCount: number;
    trackCount: number;
    isVerified: boolean;
}

// Map snake_case API responses to camelCase types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTrack(raw: any): SdkTrack {
    const id = raw.id || raw.track_id;
    return {
        id: id ? String(id) : '',
        title: raw.title || 'Unknown Track',
        user: {
            id: raw.user?.id || '',
            name: raw.user?.name || 'Unknown Artist',
            handle: raw.user?.handle || '',
            profilePicture: raw.user?.profile_picture,
        },
        artwork: raw.artwork,
        playCount: raw.play_count ?? 0,
        favoriteCount: raw.favorite_count ?? 0,
        repostCount: raw.repost_count ?? 0,
        duration: raw.duration ?? 0,
        genre: raw.genre ?? '',
        permalink: raw.permalink ?? '',
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(raw: any): SdkUser {
    return {
        id: raw.id,
        name: raw.name,
        handle: raw.handle,
        bio: raw.bio,
        profilePicture: raw.profile_picture,
        coverPhoto: raw.cover_photo,
        followerCount: raw.follower_count ?? 0,
        trackCount: raw.track_count ?? 0,
        isVerified: raw.is_verified ?? false,
    };
}

// ---- Typed helpers ----

export async function sdkSearchTracks(query: string, limit = 20): Promise<SdkTrack[]> {
    const data = await audiusFetch<unknown[]>('/tracks/search', { query, limit: String(limit) });
    return (data ?? []).map(mapTrack);
}

export async function sdkSearchUsers(query: string, limit = 10): Promise<SdkUser[]> {
    const data = await audiusFetch<unknown[]>('/users/search', { query, limit: String(limit) });
    return (data ?? []).map(mapUser);
}

export async function sdkGetTrack(trackId: string): Promise<SdkTrack | null> {
    const data = await audiusFetch<unknown>(`/tracks/${trackId}`);
    return data ? mapTrack(data) : null;
}

export function sdkStreamUrl(trackId: string | undefined): string {
    if (!trackId || trackId === 'undefined') return '';
    return `${API_BASE}/tracks/${trackId}/stream?api_key=${API_KEY}&app_name=MUSE`;
}

// Format helpers
export function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n ?? 0);
}

export function formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---- Tracks ----

export async function sdkGetTrendingTracks(limit = 10, genre?: string): Promise<SdkTrack[]> {
    const params: Record<string, string> = { limit: String(limit), time: "week" };
    if (genre && genre !== "All" && genre !== "All Genres") params.genre = genre;
    const data = await audiusFetch<unknown[]>('/tracks/trending', params);
    return (data ?? []).map(mapTrack);
}

export async function sdkGetUndergroundTrendingTracks(limit = 10): Promise<SdkTrack[]> {
    const data = await audiusFetch<unknown[]>('/tracks/trending/underground', { limit: String(limit) });
    return (data ?? []).map(mapTrack);
}
