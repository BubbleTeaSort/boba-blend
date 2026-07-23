function validatePassword(password) {
    if (typeof password !== "string") {
        return "Password is required.";
    }

    if (password.length < 8 || password.length > 64) {
        return "Password must be between 8 and 64 characters.";
    }

    if (!/\p{L}/u.test(password)) {
        return "Password must contain at least one letter.";
    }

    if (!/\d/.test(password)) {
        return "Password must contain at least one number.";
    }

    if (!/[\p{P}\p{S}]/u.test(password)) {
        return "Password must contain at least one symbol.";
    }

    if (password !== password.trim()) {
        return "Password cannot start or end with whitespace.";
    }

    const repeatThreshold =
        password.length < 16 ? 4 :
            password.length < 32 ? 5 :
                6;

    if (hasRepeatedRun(password, repeatThreshold)) {
        return "Password contains too many repeated characters.";
    }

    return null;
}

function hasRepeatedRun(password, length) {
    const regex = new RegExp(`(.)\\1{${length - 1},}`, "u");
    return regex.test(password);
}

module.exports = {
    validatePassword
};