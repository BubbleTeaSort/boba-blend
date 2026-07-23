const express = require("express");

const UsersController = require("../../../controllers/users_controller");
const requireAuth = require("../../../middleware/require_auth");

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/me/top-artists:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the current user's top Spotify artists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top artists.
 *       401:
 *         description: Not authenticated, or the Spotify connection expired.
 *       404:
 *         description: Spotify is not connected for this account.
 */
router.get("/me/top-artists", requireAuth, UsersController.getTopArtists);

/**
 * @openapi
 * /api/v1/users/me/top-tracks:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the current user's top Spotify tracks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top tracks.
 *       401:
 *         description: Not authenticated, or the Spotify connection expired.
 *       404:
 *         description: Spotify is not connected for this account.
 */
router.get("/me/top-tracks", requireAuth, UsersController.getTopTracks);

//router.get("/:id/avatar", UsersController.getAvatar);
//router.put("/:id/avatar", UsersController.uploadAvatar);
//router.delete("/:id/avatar", UsersController.deleteAvatar);

module.exports = router;