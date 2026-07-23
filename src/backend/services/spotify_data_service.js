const { pool } = require("../db/postgres_pool");
const SpotifyService = require("./spotify_service");

async function getConnection(userId) {
    const result = await pool.query(
        `
        SELECT access_token, refresh_token, expires_at
        FROM oauth_connections
        WHERE user_id = $1 AND provider = 'spotify'
        `,
        [userId]
    );

    return result.rows[0] || null;
}

async function updateTokens(userId, { accessToken, refreshToken, expiresAt }) {
    await pool.query(
        `
        UPDATE oauth_connections
        SET access_token = $2,
            refresh_token = COALESCE($3, refresh_token),
            expires_at = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND provider = 'spotify'
        `,
        [userId, accessToken, refreshToken, expiresAt]
    );
}

async function getFreshAccessToken(userId) {
    const connection = await getConnection(userId);

    if (!connection) {
        const err = new Error("Spotify is not connected for this account.");
        err.status = 404;
        throw err;
    }

    const isExpired = !connection.expires_at ||
        new Date(connection.expires_at).getTime() < Date.now() + 60_000;

    if (!isExpired) {
        return connection.access_token;
    }

    if (!connection.refresh_token) {
        const err = new Error("Spotify connection expired. Please reconnect.");
        err.status = 401;
        throw err;
    }

    const refreshed = await SpotifyService.refreshAccessToken(connection.refresh_token);
    const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000);

    await updateTokens(userId, {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token || null,
        expiresAt
    });

    return refreshed.access_token;
}

async function getTopArtists(userId) {
    const accessToken = await getFreshAccessToken(userId);
    const data = await SpotifyService.getTopArtists(accessToken, { limit: 10 });

    const artists = (data.items || []).map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images?.[0]?.url || null,
        popularity: artist.popularity ?? null
    }));

    return { artists };
}

async function getTopTracks(userId) {
    const accessToken = await getFreshAccessToken(userId);
    const data = await SpotifyService.getTopTracks(accessToken, { limit: 10 });

    const tracks = (data.items || []).map((track) => ({
        id: track.id,
        name: track.name,
        artistNames: (track.artists || []).map((artist) => artist.name),
        albumImageUrl: track.album?.images?.[0]?.url || null,
        popularity: track.popularity ?? null
    }));

    return { tracks };
}

module.exports = { getTopArtists, getTopTracks };
