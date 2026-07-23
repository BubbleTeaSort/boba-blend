const config = {
    PORT: process.env.PORT || 10000,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

    // Optional: Spotify Connect is disabled until these are set.
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
};

const required = ["DATABASE_URL"];
const missing = required.filter((key) => config[key] === undefined);

if (missing.length) {
    console.error(
        `FATAL: Missing environment variables:\n${missing
            .map(key => `  - ${key}`)
            .join("\n")}`
    );
    process.exit(1);
}

module.exports = config;