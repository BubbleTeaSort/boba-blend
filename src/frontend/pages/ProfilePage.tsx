import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BobaDecorations from "../components/BobaDecorations";
import {
    getProfile,
    getTopArtists,
    getTopTracks,
    type SpotifyProfile,
    type TopArtist,
    type TopTrack,
} from "../lib/api";
import "../styles/ProfilePage.css";

// Placeholder until we have real listening-time / discovery stats to pull.
const STATS = [
    { icon: "🎧", label: "Minutes listened this month", value: "12.4K" },
    { icon: "📅", label: "Top decade", value: "2010s" },
    { icon: "🔥", label: "Discovery score", value: "82" },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfileState] = useState<SpotifyProfile | null>(null);

    const [artists, setArtists] = useState<TopArtist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tracks, setTracks] = useState<TopTrack[]>([]);
    const [tracksLoading, setTracksLoading] = useState(true);
    const [tracksError, setTracksError] = useState("");

    useEffect(() => {
        const stored = getProfile();

        if (!stored) {
            navigate("/login", { replace: true });
            return;
        }

        setProfileState(stored);
    }, [navigate]);

    useEffect(() => {
        if (!profile) return;

        let cancelled = false;

        getTopArtists()
            .then((result) => {
                if (cancelled) return;
                setArtists(result.artists);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load your top artists.",
                );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [profile]);

    // Fetched independently from artists — a failure here should never
    // take down the rest of the page.
    useEffect(() => {
        if (!profile) return;

        let cancelled = false;

        getTopTracks()
            .then((result) => {
                if (cancelled) return;
                setTracks(result.tracks);
            })
            .catch((err) => {
                if (cancelled) return;
                setTracksError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load your top tracks.",
                );
            })
            .finally(() => {
                if (!cancelled) setTracksLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [profile]);

    if (!profile) return null;

    return (
        <>
            <BobaDecorations />
            <section className="profile page-enter">
                <div className="profile-header">
                    {profile.avatarUrl ? (
                        <img
                            className="profile-avatar"
                            src={profile.avatarUrl}
                            alt={profile.displayName}
                        />
                    ) : (
                        <div className="profile-avatar profile-avatar-fallback">
                            {profile.displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1>{profile.displayName}</h1>
                    <p className="profile-subtitle">Your BobaBlend profile</p>
                </div>

                <div className="profile-stats">
                    {STATS.map((stat) => (
                        <div className="stat-tile" key={stat.label}>
                            <span className="stat-tile-icon">{stat.icon}</span>
                            <span className="stat-tile-value">{stat.value}</span>
                            <span className="stat-tile-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="profile-section">
                    <h2>Top Artists</h2>
                    {loading ? (
                        <p className="profile-status">Loading your top artists…</p>
                    ) : error ? (
                        <p className="profile-status profile-status-error">
                            {error}
                        </p>
                    ) : artists.length > 0 ? (
                        <div className="artist-grid">
                            {artists.map((artist, index) => (
                                <div className="artist-card" key={artist.id}>
                                    <span className="artist-rank">{index + 1}</span>
                                    {artist.imageUrl ? (
                                        <img
                                            className="artist-avatar"
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                        />
                                    ) : (
                                        <div className="artist-avatar">
                                            {artist.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="artist-name">
                                        {artist.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="profile-status">
                            Not enough listening history yet — keep playing!
                        </p>
                    )}
                </div>

                <div className="profile-section">
                    <h2>Top Tracks</h2>
                    {tracksLoading ? (
                        <p className="profile-status">Loading your top tracks…</p>
                    ) : tracksError ? (
                        <p className="profile-status profile-status-error">
                            {tracksError}
                        </p>
                    ) : tracks.length > 0 ? (
                        <div className="track-list">
                            {tracks.map((track, index) => (
                                <div className="track-row" key={track.id}>
                                    <span className="track-rank">{index + 1}</span>
                                    {track.albumImageUrl ? (
                                        <img
                                            className="track-thumb"
                                            src={track.albumImageUrl}
                                            alt={track.name}
                                        />
                                    ) : (
                                        <div className="track-thumb" />
                                    )}
                                    <div className="track-info">
                                        <span className="track-name">
                                            {track.name}
                                        </span>
                                        <span className="track-artists">
                                            {track.artistNames.join(", ")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="profile-status">
                            Not enough listening history yet — keep playing!
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
