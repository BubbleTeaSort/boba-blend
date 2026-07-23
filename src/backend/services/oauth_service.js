const crypto = require("crypto");
const argon2 = require("argon2");

const { pool } = require("../db/postgres_pool");

function slugifyHandle(seed) {
    const base = (seed || "")
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 28);

    return base.length >= 3 ? base : `bobafan${base}`;
}

async function generateUniqueHandle(seed) {
    const base = slugifyHandle(seed);
    let handle = base;
    let suffix = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const existing = await pool.query(
            `SELECT id FROM users WHERE handle = $1`,
            [handle]
        );

        if (existing.rowCount === 0) return handle;

        suffix += 1;
        handle = `${base}${suffix}`.slice(0, 32);
    }
}

async function createUserFromSpotify(profile) {
    const handle = await generateUniqueHandle(profile.id || profile.display_name);
    const unusablePassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await argon2.hash(unusablePassword);

    const result = await pool.query(
        `
        INSERT INTO users (handle, password_hash, display_name, email, status)
        VALUES ($1, $2, $3, $4, 'active')
        RETURNING id, handle, display_name, status
        `,
        [
            handle,
            passwordHash,
            profile.display_name || handle,
            profile.email || null
        ]
    );

    return result.rows[0];
}

async function upsertSpotifyConnection({
    userId,
    profile,
    accessToken,
    refreshToken,
    expiresAt,
    scopes
}) {
    await pool.query(
        `
        INSERT INTO oauth_connections (
            user_id, provider, provider_user_id,
            access_token, refresh_token, expires_at, scopes,
            external_handle, external_display_name, external_avatar_url,
            profile_synced_at
        )
        VALUES ($1, 'spotify', $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, provider) DO UPDATE SET
            provider_user_id = EXCLUDED.provider_user_id,
            access_token = EXCLUDED.access_token,
            refresh_token = EXCLUDED.refresh_token,
            expires_at = EXCLUDED.expires_at,
            scopes = EXCLUDED.scopes,
            external_handle = EXCLUDED.external_handle,
            external_display_name = EXCLUDED.external_display_name,
            external_avatar_url = EXCLUDED.external_avatar_url,
            profile_synced_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        `,
        [
            userId,
            profile.id,
            accessToken,
            refreshToken,
            expiresAt,
            scopes,
            profile.id,
            profile.display_name || null,
            profile.images?.[0]?.url || null
        ]
    );
}

async function findUserIdBySessionToken(token) {
    if (!token) return null;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const result = await pool.query(
        `
        SELECT user_id
        FROM sessions
        WHERE token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        `,
        [tokenHash]
    );

    return result.rows[0]?.user_id ?? null;
}

module.exports = {
    createUserFromSpotify,
    upsertSpotifyConnection,
    findUserIdBySessionToken
};
