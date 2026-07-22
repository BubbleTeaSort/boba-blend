import { Link } from "react-router-dom";
import "../styles/ResultsPage.css";

export default function ResultsPage() {
    return (
        <section className="results page-enter">
            <h1>🎉 Your Blend</h1>
            <p>
                Your compatibility report will appear here once you and a friend
                have connected your Spotify accounts.
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
