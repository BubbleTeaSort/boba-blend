import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            Made with <span>♥</span> and lots of boba — BobaBlend &copy;{" "}
            {new Date().getFullYear()}
        </footer>
    );
}
