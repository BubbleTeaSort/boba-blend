import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./frontend/components/Header";
import Footer from "./frontend/components/Footer";
import LandingPage from "./frontend/pages/LandingPage";
import LoginPage from "./frontend/pages/LoginPage";
import ProfilePage from "./frontend/pages/ProfilePage";
import ResultsPage from "./frontend/pages/ResultsPage";
import SpotifyCallbackPage from "./frontend/pages/SpotifyCallbackPage";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<Navigate to="/login" replace />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/spotify/callback" element={<SpotifyCallbackPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
