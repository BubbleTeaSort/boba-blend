const argon2 = require('argon2');

async function hash(key) {
    try {
        return await argon2.hash(key);
    } catch (err) {
        throw new Error('Error hashing key');
    }
}

async function verify(hashedKey, plainKey) {
    try {
        return await argon2.verify(hashedKey, plainKey);
    } catch (err) {
        throw new Error('Error verifying key');
    }
}

module.exports = { hash, verify };
