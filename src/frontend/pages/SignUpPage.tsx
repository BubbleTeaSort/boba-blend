import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";
import { ApiError, signUp, setToken, getSpotifyConnectUrl } from "../lib/api";
import "../styles/AuthPage.css";

export default function SignUpPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        handle: "",
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
            const { token } = await signUp({
                handle: form.handle,
                password: form.password,
            });
            setToken(token);
            navigate("/results");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Sign up failed");
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
                    <h1>Create Account</h1>
                    <p className="auth-subtitle">
                        Join BobaBlend and discover your music match
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
                                minLength={3}
                                maxLength={32}
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
                        Already have an account?{" "}
                        <Link to="/login">Log in</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
