import { Link, useLocation } from "react-router-dom";
import { getProfile } from "../lib/api";
import "./Header.css";

export default function Header() {
    // useLocation subscribes to route changes, so this re-reads on every
    // navigation (e.g. right after the Spotify callback stores a profile).
    useLocation();
    const profile = getProfile();

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                <span className="header-logo-icon">
                    <svg
                        className="boba-cup"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Cup body */}
                        <rect
                            x="8"
                            y="10"
                            width="16"
                            height="18"
                            rx="3"
                            fill="currentColor"
                            opacity="0.2"
                        />
                        <rect
                            x="8"
                            y="10"
                            width="16"
                            height="18"
                            rx="3"
                            stroke="#8B5CF6"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        {/* Lid */}
                        <rect
                            x="7"
                            y="8"
                            width="18"
                            height="3"
                            rx="1.5"
                            fill="#8B5CF6"
                            opacity="0.3"
                        />
                        {/* Straw */}
                        <line
                            x1="19"
                            y1="8"
                            x2="22"
                            y2="2"
                            stroke="#EC4899"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        {/* Boba pearls */}
                        <circle
                            cx="12"
                            cy="22"
                            r="2"
                            fill="#F59E0B"
                            opacity="0.7"
                        />
                        <circle
                            cx="17"
                            cy="24"
                            r="2"
                            fill="#F59E0B"
                            opacity="0.7"
                        />
                        <circle
                            cx="14"
                            cy="20"
                            r="1.8"
                            fill="#F59E0B"
                            opacity="0.6"
                        />
                        <circle
                            cx="20"
                            cy="22"
                            r="1.5"
                            fill="#F59E0B"
                            opacity="0.5"
                        />
                    </svg>
                </span>
                BobaBlend
            </Link>

            <nav className="header-nav">
                <Link to="/">Home</Link>
                {profile ? (
                    <Link to="/profile" className="header-profile">
                        {profile.avatarUrl ? (
                            <img
                                className="header-avatar"
                                src={profile.avatarUrl}
                                alt={profile.displayName}
                            />
                        ) : (
                            <span className="header-avatar header-avatar-fallback">
                                {profile.displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        {profile.displayName}
                    </Link>
                ) : (
                    <Link to="/login" className="btn-login">
                        Connect Spotify
                    </Link>
                )}
            </nav>
        </header>
    );
}
