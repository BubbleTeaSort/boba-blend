import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import "./SignUpPage.css";

export default function SignUpPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // TODO: POST to /api/auth/signup
            console.log("Sign up payload:", {
                username: form.username,
                email: form.email,
                password: form.password,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign up failed");
        } finally {
            setLoading(false);
        }
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
                    <h1>Create Account</h1>
                    <p className="auth-subtitle">
                        Join BobaBlend and discover your music match
                    </p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="bobalover42"
                                autoComplete="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account…" : "Create Account"}
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
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
