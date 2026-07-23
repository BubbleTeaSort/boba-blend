const SessionService = require("../services/session_service");

module.exports = async function authenticate(req, res, next) {
    const token =
        req.cookies?.session ||
        (req.get("Authorization")?.startsWith("Bearer ")
            ? req.get("Authorization").substring(7)
            : null);

    if (!token) {
        return res.sendStatus(401);
    }

    const session = await SessionService.validate(token);

    if (!session) {
        return res.sendStatus(401);
    }

    req.user = session;

    next();
};