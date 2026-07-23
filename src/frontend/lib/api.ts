const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";
const TOKEN_KEY = "bobablend_token";
const PROFILE_KEY = "bobablend_profile";

export interface SpotifyProfile {
    displayName: string;
    avatarUrl: string;
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function setProfile(profile: SpotifyProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile(): SpotifyProfile | null {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as SpotifyProfile;
    } catch {
        return null;
    }
}

export function clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
}

export function getSpotifyConnectUrl() {
    const token = getToken();
    const url = new URL(
        `${API_BASE_URL}/oauth/spotify/login`,
        window.location.origin,
    );
    if (token) url.searchParams.set("token", token);
    return url.toString();
}

export interface TopArtist {
    id: string;
    name: string;
    imageUrl: string | null;
    popularity: number | null;
}

export interface TopArtistsResponse {
    artists: TopArtist[];
}

export async function getTopArtists(): Promise<TopArtistsResponse> {
    const token = getToken();

    const res = await fetch(`${API_BASE_URL}/users/me/top-artists`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            data && typeof data === "object" && "error" in data
                ? String((data as { error: unknown }).error)
                : "Failed to load your top artists.";
        throw new Error(message);
    }

    if (!data || typeof data !== "object" || !Array.isArray(data.artists)) {
        throw new Error("Got an unexpected response loading your top artists.");
    }

    return data as TopArtistsResponse;
}

export interface TopTrack {
    id: string;
    name: string;
    artistNames: string[];
    albumImageUrl: string | null;
    popularity: number | null;
}

export interface TopTracksResponse {
    tracks: TopTrack[];
}

export async function getTopTracks(): Promise<TopTracksResponse> {
    const token = getToken();

    const res = await fetch(`${API_BASE_URL}/users/me/top-tracks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            data && typeof data === "object" && "error" in data
                ? String((data as { error: unknown }).error)
                : "Failed to load your top tracks.";
        throw new Error(message);
    }

    if (!data || typeof data !== "object" || !Array.isArray(data.tracks)) {
        throw new Error("Got an unexpected response loading your top tracks.");
    }

    return data as TopTracksResponse;
}
