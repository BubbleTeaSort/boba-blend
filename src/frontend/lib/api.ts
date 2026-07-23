const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";
const TOKEN_KEY = "bobablend_token";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function request<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            (data && typeof data === "object" && "error" in data
                ? String((data as { error: unknown }).error)
                : null) ?? "Something went wrong. Please try again.";
        throw new ApiError(message, res.status);
    }

    return data as T;
}

export interface AuthUser {
    id: number;
    handle: string;
    displayName: string | null;
    status: string;
}

export interface AuthResponse {
    message: string;
    user: AuthUser;
    token: string;
}

export function signUp(payload: { handle: string; password: string }) {
    return request<AuthResponse>("/auth/signup", payload);
}

export function logIn(payload: { handle: string; password: string }) {
    return request<AuthResponse>("/auth/login", payload);
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

export function getSpotifyConnectUrl() {
    const token = getToken();
    const url = new URL(
        `${API_BASE_URL}/oauth/spotify/login`,
        window.location.origin,
    );
    if (token) url.searchParams.set("token", token);
    return url.toString();
}
