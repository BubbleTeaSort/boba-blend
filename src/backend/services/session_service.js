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

async function validate(token) {
    if (!token) {
        return null;
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const result = await pool.query(
        `
        SELECT
            s.user_id,
            s.expires_at,
            u.handle,
            u.display_name,
            u.status
        FROM sessions s
        JOIN users u
            ON u.id = s.user_id
        WHERE s.token_hash = $1
          AND s.revoked_at IS NULL
          AND s.expires_at > CURRENT_TIMESTAMP
        `,
        [tokenHash]
    );

    if (result.rowCount === 0) {
        return null;
    }

    await touch(tokenHash);

    return {
        userId: result.rows[0].user_id,
        handle: result.rows[0].handle,
        displayName: result.rows[0].display_name,
        status: result.rows[0].status
    };
}

module.exports = {
    create,
    revoke,
    revokeAllForUser,
    touch,
    validate
};