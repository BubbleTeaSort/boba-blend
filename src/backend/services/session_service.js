const crypto = require("crypto");

const Constants = require('../config/constants');
const { pool } = require("../db/postgres_pool");

async function create({
    userId,
    ipAddress,
    userAgent
}) {
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const expiresAt = new Date(
        Date.now() + Constants.SESSION_DURATION_MS
    );

    await pool.query(
        `
        INSERT INTO sessions (
            user_id,
            token_hash,
            ip_address,
            user_agent,
            expires_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        `,
        [
            userId,
            tokenHash,
            ipAddress,
            userAgent,
            expiresAt
        ]
    );

    return token;
}

async function revoke(tokenHash) {
    await pool.query(
        `
        UPDATE sessions
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE token_hash = $1
          AND revoked_at IS NULL
        `,
        [tokenHash]
    );
}

async function revokeAllForUser(userId) {
    await pool.query(
        `
        UPDATE sessions
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
          AND revoked_at IS NULL
        `,
        [userId]
    );
}

async function touch(tokenHash) {
    await pool.query(
        `
        UPDATE sessions
        SET last_used_at = CURRENT_TIMESTAMP
        WHERE token_hash = $1
        `,
        [tokenHash]
    );
}

module.exports = {
    create,
    revoke,
    revokeAllForUser,
    touch
};