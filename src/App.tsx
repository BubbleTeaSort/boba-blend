import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./frontend/components/Header";
import Footer from "./frontend/components/Footer";
import LandingPage from "./frontend/pages/LandingPage";
import LoginPage from "./frontend/pages/LoginPage";
import SignUpPage from "./frontend/pages/SignUpPage";
import ResultsPage from "./frontend/pages/ResultsPage";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
