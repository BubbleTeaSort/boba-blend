const SessionService = require("../services/session_service");

module.exports = async function authenticate(req, res, next) {
    const auth = req.get("Authorization");

    if (!auth?.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = auth.substring(7);

    const session = await SessionService.validate(token);

    if (!session) {
        return res.sendStatus(401);
    }

    req.user = session;

    next();
};