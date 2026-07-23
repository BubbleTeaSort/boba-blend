import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import { ApiError, logIn, setToken, getSpotifyConnectUrl } from "../lib/api";
import "../styles/AuthPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        handle: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (searchParams.get("error") === "spotify_auth_failed") {
            setError("Spotify login failed. Please try again.");
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { token } = await logIn(form);
            setToken(token);
            navigate("/results");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Log in failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSpotifyConnect = () => {
        window.location.href = getSpotifyConnectUrl();
    };

    return (
        <>
            <BobaDecorations />
            <section className="auth-page">
                <div className="auth-card page-enter">
                    <h1>Welcome Back</h1>
                    <p className="auth-subtitle">
                        Log in to see your music compatibility
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="handle">Username</label>
                            <input
                                id="handle"
                                type="text"
                                placeholder="bobalover42"
                                autoComplete="username"
                                value={form.handle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in…" : "Log In"}
                        </button>
                    </form>

                    <div className="form-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn-spotify-connect"
                        onClick={handleSpotifyConnect}
                    >
                        <FaSpotify />
                        Continue with Spotify
                    </button>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
