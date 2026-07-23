import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../lib/api";

export default function SpotifyCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            setToken(token);
            navigate("/results", { replace: true });
        } else {
            navigate("/login?error=spotify_auth_failed", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <section className="auth-page">
            <p>Connecting to Spotify…</p>
        </section>
    );
}
