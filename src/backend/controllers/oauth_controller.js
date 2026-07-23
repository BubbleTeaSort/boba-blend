const crypto = require("crypto");

const SpotifyService = require("../services/spotify_service");
const OAuthService = require("../services/oauth_service");
const SessionService = require("../services/session_service");
const Env = require("../config/env");

function encodeState(payload) {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeState(state) {
    try {
        return JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    } catch {
        return {};
    }
}

function spotifyLogin(req, res) {
    if (!SpotifyService.isConfigured()) {
        return res.status(500).json({
            error: "Spotify login is not configured yet."
        });
    }

    const state = encodeState({
        token: typeof req.query.token === "string" ? req.query.token : null,
        nonce: crypto.randomBytes(8).toString("hex")
    });

    res.redirect(SpotifyService.buildAuthorizeUrl(state));
}

async function spotifyCallback(req, res) {
    const { code, error, state } = req.query;

    if (error || typeof code !== "string") {
        return res.redirect(`${Env.FRONTEND_URL}/login?error=spotify_auth_failed`);
    }

    try {
        const { token: existingToken } = decodeState(
            typeof state === "string" ? state : ""
        );

        const tokenResponse = await SpotifyService.exchangeCodeForToken(code);
        const profile = await SpotifyService.getProfile(tokenResponse.access_token);

        const existingUserId = await OAuthService.findUserIdBySessionToken(existingToken);
        const userId = existingUserId
            ?? (await OAuthService.createUserFromSpotify(profile)).id;

        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

        await OAuthService.upsertSpotifyConnection({
            userId,
            profile,
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt,
            scopes: tokenResponse.scope ? tokenResponse.scope.split(" ") : []
        });

        const sessionToken = await SessionService.create({
            userId,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent")
        });

        res.redirect(`${Env.FRONTEND_URL}/spotify/callback?token=${sessionToken}`);
    } catch (err) {
        console.error("Spotify OAuth callback failed:", err);
        res.redirect(`${Env.FRONTEND_URL}/login?error=spotify_auth_failed`);
    }
}

module.exports = { spotifyLogin, spotifyCallback };
