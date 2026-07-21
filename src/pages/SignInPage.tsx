import { Link } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import BobaDecorations from "../components/BobaDecorations";

export default function SignInPage() {
    return (
        <>
            <BobaDecorations />
            <section className="signin">
                <div className="signin-card page-enter">
                    <h1>Join BobaBlend</h1>
                    <p className="subtitle">
                        Create your account or connect Spotify to get started
                    </p>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="bobalover42"
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>

                        <button type="submit" className="btn-submit">
                            Create Account
                        </button>
                    </form>

                    <div className="form-divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="btn-spotify-connect">
                        <FaSpotify />
                        Connect with Spotify
                    </button>

                    <div className="signin-footer">
                        Already have an account?{" "}
                        <Link to="/signin">Log in</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
