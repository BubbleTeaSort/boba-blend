import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, type SpotifyProfile } from "../lib/api";
import "../styles/ResultsPage.css";

export default function ResultsPage() {
    const navigate = useNavigate();
    const [profile, setProfileState] = useState<SpotifyProfile | null>(null);

    useEffect(() => {
        const stored = getProfile();

        if (!stored) {
            navigate("/login", { replace: true });
            return;
        }

        setProfileState(stored);
    }, [navigate]);

    if (!profile) return null;

    return (
        <section className="results page-enter">
            {profile.avatarUrl ? (
                <img
                    className="results-avatar"
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                />
            ) : (
                <div className="results-avatar results-avatar-fallback">
                    {profile.displayName.charAt(0).toUpperCase()}
                </div>
            )}

            <h1>{profile.displayName}</h1>

            <p>
                Your compatibility report will appear here once you and a
                friend have connected your Spotify accounts.
            </p>

            <Link
                to="/"
                className="btn-spotify"
                style={{ textDecoration: "none" }}
            >
                Back home
            </Link>
        </section>
    );
}
