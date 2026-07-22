import "./BobaDecorations.css";

export default function BobaDecorations() {
    return (
        <div className="boba-decorations" aria-hidden="true">
            {/* Floating bubbles */}
            <div className="boba-bubble boba-bubble-1" />
            <div className="boba-bubble boba-bubble-2" />
            <div className="boba-bubble boba-bubble-5" />
            <div className="boba-bubble boba-bubble-6" />

            {/* Tapioca pearls at the bottom */}
            <div className="boba-tapioca boba-tapioca-1" />
            <div className="boba-tapioca boba-tapioca-2" />
            <div className="boba-tapioca boba-tapioca-3" />
        </div>
    );
}
