export interface AudiusUser {
    id: string;
    name: string;
    handle: string;
    profile_picture?: {
        "150x150": string;
        "480x480": string;
        "1000x1000": string;
    };
    follower_count: number;
    track_count: number;
}

export interface AudiusTrack {
    id: string;
    track_id: number;
    title: string;
    duration: number;
    play_count: number;
    favorite_count: number;
    repost_count: number;
    release_date: string;
    artwork?: {
        "150x150": string;
        "480x480": string;
        "1000x1000": string;
    };
    user: AudiusUser;
}

export interface AudiusPlaylist {
    id: string;
    playlist_id: number;
    playlist_name: string;
    description: string;
    total_play_count: number;
    favorite_count: number;
    repost_count: number;
    user: AudiusUser;
    tracks: AudiusTrack[];
    artwork?: {
        "150x150": string;
        "480x480": string;
        "1000x1000": string;
    };
}

export interface AudiusPlaylistResponse {
    data: AudiusPlaylist[];
}
