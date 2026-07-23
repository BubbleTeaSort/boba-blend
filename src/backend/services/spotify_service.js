const axios = require("axios");

const Env = require("../config/env");

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const PROFILE_URL = "https://api.spotify.com/v1/me";

const SCOPES = [
    "user-read-email",
    "user-read-private",
    "playlist-read-private",
    "user-top-read"
].join(" ");

function isConfigured() {
    return Boolean(
        Env.SPOTIFY_CLIENT_ID &&
        Env.SPOTIFY_CLIENT_SECRET &&
        Env.SPOTIFY_REDIRECT_URI
    );
}

function buildAuthorizeUrl(state) {
    const params = new URLSearchParams({
        client_id: Env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: Env.SPOTIFY_REDIRECT_URI,
        scope: SCOPES,
        state
    });

    return `${AUTHORIZE_URL}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
    const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: Env.SPOTIFY_REDIRECT_URI
        }).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(
                    `${Env.SPOTIFY_CLIENT_ID}:${Env.SPOTIFY_CLIENT_SECRET}`
                ).toString("base64")
            }
        }
    );

    return response.data;
}

async function getProfile(accessToken) {
    const response = await axios.get(PROFILE_URL, {
        headers: { Authorization: "Bearer " + accessToken }
    });

    return response.data;
}

module.exports = {
    isConfigured,
    buildAuthorizeUrl,
    exchangeCodeForToken,
    getProfile
};
