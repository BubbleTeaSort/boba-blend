import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import "../styles/AuthPage.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    };

    const handleSpotifyConnect = () => {
        // TODO: Redirect to Spotify OAuth
        console.log("Spotify connect clicked");
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
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={form.email}
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
