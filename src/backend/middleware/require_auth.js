const SessionService = require("../services/session_service");

async function requireAuth(req, res, next) {
    const header = req.get("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

    const session = await SessionService.validate(token);

    if (!session) {
        return res.status(401).json({
            error: "Session expired or invalid. Please reconnect."
        });
    }

    req.userId = session.userId;
    next();
}

module.exports = requireAuth;
