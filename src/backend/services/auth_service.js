const crypto = require("crypto");

const SessionService = require("./session_service");
const { pool } = require("../db/postgres_pool");
const { hash, verify } = require("../utils/crypto");

async function signup({
    handle,
    password,
    displayName,
    ipAddress,
    userAgent
}) {
    //
    // Validation
    //

    if (!handle || !password) {
        const err = new Error("Handle and password are required.");
        err.status = 400;
        throw err;
    }

    handle = handle.toLowerCase();

    if (handle.length < 3 || handle.length > 32) {
        const err = new Error("Handle must be between 3 and 32 characters.");
        err.status = 400;
        throw err;
    }

    //
    // Ensure handle is available
    //

    const existingUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE handle = $1
        `,
        [handle]
    );

    if (existingUser.rowCount !== 0) {
        const err = new Error("Handle is already taken.");
        err.status = 409;
        throw err;
    }

    //
    // Hash password
    //

    const passwordHash = await hash(password);

    //
    // Create user
    //

    const userResult = await pool.query(
        `
        INSERT INTO users (
            handle,
            password_hash,
            display_name,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            'pending_verification'
        )
        RETURNING
            id,
            handle,
            display_name,
            status,
            created_at
        `,
        [
            handle,
            passwordHash,
            displayName ?? handle
        ]
    );

    const user = userResult.rows[0];

    //
    // Create session
    //

    const token = await SessionService.create({
        userId: user.id,
        ipAddress,
        userAgent
    });

    //
    // Return DTO
    //

    return {
        message: "User registered successfully.",
        user: {
            id: user.id,
            handle: user.handle,
            displayName: user.display_name,
            status: user.status
        },
        token
    };
}

module.exports = {
    signup
};

async function login({
    handle,
    password,
    ipAddress,
    userAgent
}) {
    //
    // Validation
    //

    if (!handle || !password) {
        const err = new Error("Handle and password are required.");
        err.status = 400;
        throw err;
    }

    handle = handle.toLowerCase();

    //
    // Lookup user
    //

    const result = await pool.query(
        `
        SELECT
            id,
            handle,
            display_name,
            password_hash,
            status
        FROM users
        WHERE handle = $1
        `,
        [handle]
    );

    if (result.rowCount === 0) {
        const err = new Error("Invalid handle or password.");
        err.status = 401;
        throw err;
    }

    const user = result.rows[0];

    //
    // Check account status
    //

    if (user.status !== "active" && user.status !== "pending_verification") {
        const err = new Error("Account is unavailable.");
        err.status = 403;
        throw err;
    }

    //
    // Verify password
    //

    const validPassword = await verify(
        user.password_hash,
        password
    );

    if (!validPassword) {
        const err = new Error("Invalid handle or password.");
        err.status = 401;
        throw err;
    }

    //
    // Create session
    //

    const token = await SessionService.create({
        userId: user.id,
        ipAddress,
        userAgent
    });

    //
    // Update last login
    //

    await pool.query(
        `
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [user.id]
    );

    //
    // Return DTO
    //

    return {
        message: "Login successful.",
        user: {
            id: user.id,
            handle: user.handle,
            displayName: user.display_name,
            status: user.status
        },
        token
    };
}

module.exports = {
    signup,
    login
};