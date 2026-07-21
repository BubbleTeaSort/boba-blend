import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import ResultsPage from "./pages/ResultsPage";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
