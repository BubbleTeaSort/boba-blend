import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import { getSpotifyConnectUrl } from "../lib/api";
import "../styles/AuthPage.css";

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState("");

    useEffect(() => {
        if (searchParams.get("error") === "spotify_auth_failed") {
            setError("Spotify login failed. Please try again.");
        }
    }, [searchParams]);

    const handleSpotifyConnect = () => {
        window.location.href = getSpotifyConnectUrl();
    };

    return (
        <>
            <BobaDecorations />
            <section className="auth-page">
                <div className="auth-card page-enter">
                    <h1>Welcome to BobaBlend</h1>
                    <p className="auth-subtitle">
                        Connect your Spotify account to get started — no
                        password needed
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        type="button"
                        className="btn-spotify-connect"
                        onClick={handleSpotifyConnect}
                    >
                        <FaSpotify />
                        Continue with Spotify
                    </button>
                </div>
            </section>
        </>
    );
}
