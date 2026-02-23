
// Enhanced Radio Browser API SDK with caching, metadata, and better search

const BASE_URL = "https://de1.api.radio-browser.info/json";

// Cache for station data to reduce API calls
const stationCache = new Map<string, { data: ZenoStation[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface ZenoStation {
    id: string;
    name: string;
    url: string; // Stream URL
    favicon: string;
    tags: string;
    country: string;
    bitrate: number;
    votes: number;
    codec: string;
    language: string;
    lastCheckTime: number;
    clickCount: number;
    lastCheckOk: boolean;
}

export interface RadioSearchOptions {
    limit?: number;
    tag?: string;
    name?: string;
    country?: string;
    language?: string;
    bitrateMin?: number;
    bitrateMax?: number;
    order?: 'clickcount' | 'votes' | 'bitrate' | 'name' | 'country' | 'language';
    reverse?: boolean;
}

// Get stations with enhanced filtering and caching
export async function getZenoStations(options: RadioSearchOptions = {}): Promise<ZenoStation[]> {
    const {
        limit = 20,
        tag,
        name,
        country,
        language,
        bitrateMin,
        bitrateMax,
        order = 'clickcount',
        reverse = true
    } = options;

    // Generate cache key based on search parameters
    const cacheKey = JSON.stringify({ limit, tag, name, country, language, bitrateMin, bitrateMax, order, reverse });
    
    // Check cache first
    const cached = stationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const params = new URLSearchParams({
            limit: String(limit),
            hidebroken: 'true',
            order: order,
            reverse: String(reverse)
        });

        if (tag) params.append('tag', tag);
        if (name) params.append('name', name);
        if (country) params.append('country', country);
        if (language) params.append('language', language);
        if (bitrateMin) params.append('bitrate_min', String(bitrateMin));
        if (bitrateMax) params.append('bitrate_max', String(bitrateMax));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`${BASE_URL}/stations/search?${params.toString()}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Failed to fetch stations: ${res.status}`);

        const data = await res.json();

        const stations: ZenoStation[] = data.map((st: any) => ({
            id: st.stationuuid,
            name: st.name.trim(),
            url: st.url_resolved || st.url,
            favicon: st.favicon || "/api/placeholder/64/64",
            tags: st.tags || "",
            country: st.country || "Unknown",
            bitrate: st.bitrate || 0,
            votes: st.votes || 0,
            codec: st.codec || "unknown",
            language: st.language || "",
            lastCheckTime: st.lastchecktime || 0,
            clickCount: st.clickcount || 0,
            lastCheckOk: st.lastcheckok || false
        })).filter((station: ZenoStation) => station.lastCheckOk && station.bitrate > 0);

        // Cache the results
        stationCache.set(cacheKey, { data: stations, timestamp: Date.now() });

        return stations;
    } catch (e) {
        console.error("ZenoSDK Error:", e);
        
        // Return cached data if available, even if stale
        if (cached) {
            console.warn("Using cached station data due to API error");
            return cached.data;
        }
        
        return [];
    }
}

// Get station by ID
export async function getZenoStationById(id: string): Promise<ZenoStation | null> {
    try {
        const res = await fetch(`${BASE_URL}/stations/byuuid/${id}`);
        if (!res.ok) return null;
        
        const data = await res.json();
        if (!data || data.length === 0) return null;
        
        const st = data[0];
        return {
            id: st.stationuuid,
            name: st.name.trim(),
            url: st.url_resolved || st.url,
            favicon: st.favicon || "",
            tags: st.tags,
            country: st.country,
            bitrate: st.bitrate,
            votes: st.votes,
            codec: st.codec || "unknown",
            language: st.language || "",
            lastCheckTime: st.lastchecktime || 0,
            clickCount: st.clickcount || 0,
            lastCheckOk: st.lastcheckok || false
        };
    } catch (e) {
        console.error("ZenoSDK Error:", e);
        return null;
    }
}

// Search stations with multiple criteria
export async function searchZenoStations(query: string, limit = 20): Promise<ZenoStation[]> {
    return getZenoStations({
        name: query,
        limit,
        order: 'clickcount',
        reverse: true
    });
}

// Get trending stations (most clicked)
export async function getTrendingStations(limit = 10): Promise<ZenoStation[]> {
    return getZenoStations({
        limit,
        order: 'clickcount',
        reverse: true
    });
}

// Get high-quality stations (high bitrate)
export async function getHQStations(limit = 15): Promise<ZenoStation[]> {
    return getZenoStations({
        limit,
        bitrateMin: 128,
        order: 'bitrate',
        reverse: true
    });
}

// Get stations by country
export async function getStationsByCountry(countryCode: string, limit = 20): Promise<ZenoStation[]> {
    return getZenoStations({
        country: countryCode,
        limit,
        order: 'clickcount',
        reverse: true
    });
}

// Get stations by genre/tag
export async function getStationsByTag(tag: string, limit = 20): Promise<ZenoStation[]> {
    return getZenoStations({
        tag,
        limit,
        order: 'clickcount',
        reverse: true
    });
}
