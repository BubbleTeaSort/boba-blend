const { Pool } = require('pg');

const Env = require('../config/env');

const pool = new Pool({
    connectionString: Env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
    await pool.query(`
        CREATE EXTENSION IF NOT EXISTS citext;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_type
                WHERE typname = 'user_status'
            ) THEN
                CREATE TYPE user_status AS ENUM (
                    'pending_verification',
                    'active',
                    'suspended',
                    'banned',
                    'deactivated'
                );
            END IF;
        END
        $$;
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            -- Credentials
            email CITEXT UNIQUE,
            handle CITEXT NOT NULL UNIQUE CHECK (char_length(handle) BETWEEN 3 AND 32),
            password_hash VARCHAR(255) NOT NULL,
            
            -- Profile
            display_name VARCHAR(32),
            avatar_url TEXT,
            
            status user_status NOT NULL DEFAULT 'pending_verification',
            is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
            
            email_verification_token_hash VARCHAR(255),
            email_verification_expires_at TIMESTAMP WITH TIME ZONE,
            
            password_reset_token_hash VARCHAR(255),
            password_reset_expires_at TIMESTAMP WITH TIME ZONE,
            
            last_password_change_at TIMESTAMP WITH TIME ZONE,
            failed_login_attempts INT NOT NULL DEFAULT 0,
            locked_until TIMESTAMP WITH TIME ZONE,
            last_login_at TIMESTAMP WITH TIME ZONE,
            
            deleted_at TIMESTAMP WITH TIME ZONE,
            
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_handle ON users(handle) WHERE handle IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE status != 'active';
        CREATE INDEX IF NOT EXISTS idx_users_email_token ON users(email_verification_token_hash) WHERE email_verification_token_hash IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(password_reset_token_hash) WHERE password_reset_token_hash IS NOT NULL;
    `);
}

module.exports = { pool, initDatabase };