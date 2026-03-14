// Audius API helpers — read-only calls using the REST API
const API_BASE = 'https://api.audius.co/v1';
const API_KEY = process.env.NEXT_PUBLIC_AUDIUS_API_KEY || '0xae4d3e296787e296b704511d724e7fac088ce029';

interface AudiusRequestOptions {
    endpoint: string;
    params?: Record<string, string>;
}

async function audiusFetch<T>({ endpoint, params }: AudiusRequestOptions): Promise<T | null> {
    try {
        const url = new URL(`${API_BASE}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (key && value) url.searchParams.set(key, value);
            });
        }
        const res = await fetch(url.toString(), {
            headers: { 'x-api-key': API_KEY, Accept: 'application/json' },
            next: { revalidate: 300 }, // cache 5 min
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch (e) {
        console.warn(`Audius fetch failed for ${endpoint}:`, e);
        return null;
    }
}

// ---- Public helpers ----

export interface AudiusTrack {
    id: string;
    title: string;
    user: { id: string; name: string; handle: string; profile_picture?: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string } };
    artwork?: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string };
    play_count: number;
    favorite_count: number;
    repost_count: number;
    duration: number;
    genre: string;
    release_date?: string;
    permalink: string;
}

export interface AudiusUser {
    id: string;
    name: string;
    handle: string;
    bio?: string;
    profile_picture?: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string };
    cover_photo?: { '640x'?: string; '2000x'?: string };
    follower_count: number;
    followee_count: number;
    track_count: number;
    is_verified: boolean;
}

export interface AudiusPlaylist {
    id: string;
    playlist_name: string;
    description: string | null;
    artwork: { '150x150'?: string; '480x480'?: string; '1000x1000'?: string } | null;
    tracks: AudiusTrack[];
    user: AudiusUser;
}

export async function getTrendingTracks(limit = 10): Promise<AudiusTrack[]> {
    const data = await audiusFetch<AudiusTrack[]>({ endpoint: '/tracks/trending', params: { limit: String(limit) } });
    return data ?? [];
}

export async function searchTracks(query: string, limit = 20): Promise<AudiusTrack[]> {
    const data = await audiusFetch<AudiusTrack[]>({ endpoint: '/tracks/search', params: { query, limit: String(limit) } });
    return data ?? [];
}

export async function searchUsers(query: string, limit = 10): Promise<AudiusUser[]> {
    const data = await audiusFetch<AudiusUser[]>({ endpoint: '/users/search', params: { query, limit: String(limit) } });
    return data ?? [];
}

export async function getTrack(trackId: string): Promise<AudiusTrack | null> {
    return audiusFetch<AudiusTrack>({ endpoint: `/tracks/${trackId}` });
}

export async function getUser(userId: string): Promise<AudiusUser | null> {
    return audiusFetch<AudiusUser>({ endpoint: `/users/${userId}` });
}

export async function getUserTracks(userId: string, limit = 20): Promise<AudiusTrack[]> {
    const data = await audiusFetch<AudiusTrack[]>({ endpoint: `/users/${userId}/tracks`, params: { limit: String(limit) } });
    return data ?? [];
}

export function getStreamUrl(trackId: string | undefined): string {
    if (!trackId || trackId === 'undefined') return '';
    return `${API_BASE}/tracks/${trackId}/stream?api_key=${API_KEY}&app_name=MUSE`;
}

export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPlayCount(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return String(count);
}
