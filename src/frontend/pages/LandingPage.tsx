import { Link } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import "../styles/LandingPage.css";

export default function LandingPage() {
    return (
        <>
            <BobaDecorations />
            <section className="landing">
                <div className="landing-content page-enter">
                    <div className="landing-badge">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        Discover your music compatibility
                    </div>

                    <h1>
                        Blend your <br />
                        Spotify taste
                    </h1>

                    <p className="subtitle">
                        Compare playlists, see what you have in common, and find
                        your perfect music match — one boba sip at a time.
                    </p>

                    <div className="landing-cta">
                        <Link to="/login" className="btn-spotify">
                            <FaSpotify className="spotify-logo" />
                            Continue with Spotify
                        </Link>
                    </div>

                    <div className="landing-features">
                        <div className="feature-card">
                            <span className="icon">🎧</span>
                            <h3>Compare Taste</h3>
                            <p>
                                See how your music taste stacks up against a
                                friend
                            </p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">🧋</span>
                            <h3>Match Score</h3>
                            <p>
                                Get a compatibility percentage and shared
                                favorites
                            </p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">✨</span>
                            <h3>Discover Gems</h3>
                            <p>Uncover new music from each other's playlists</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
