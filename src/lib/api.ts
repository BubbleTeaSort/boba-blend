const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
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
            (data && typeof data === "object" && "message" in data
                ? String((data as { message: unknown }).message)
                : null) ?? "Something went wrong. Please try again.";
        throw new ApiError(message, res.status);
    }

    return data as T;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export function signUp(payload: {
    username: string;
    email: string;
    password: string;
}) {
    return request<AuthResponse>("/auth/signup", payload);
}

export function logIn(payload: { email: string; password: string }) {
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
