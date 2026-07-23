const AuthService = require("../services/auth_service");
const Constants = require("../config/constants");
const Env = require("../config/env");

function setSessionCookie(res, token) {
    res.cookie("session", token, {
        httpOnly: true,
        secure: Env.PRODUCTION === "1",
        sameSite: "lax",
        maxAge: Constants.SESSION_DURATION_MS,
        path: "/"
    });
}

async function signup(req, res, next) {
    try {
        const result = await AuthService.signup({
            handle: req.body.handle,
            password: req.body.password,
            displayName: req.body.displayName,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent")
        });

        setSessionCookie(res, result.token);

        delete result.token;

        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const result = await AuthService.login({
            handle: req.body.handle,
            password: req.body.password,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent")
        });

        setSessionCookie(res, result.token);

        delete result.token;

        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    signup,
    login
};