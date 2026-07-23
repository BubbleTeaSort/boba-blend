const express = require("express");

const OAuthController = require("../../../controllers/oauth_controller");

const router = express.Router();

/**
 * @openapi
 * /api/v1/oauth/spotify/login:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Start Spotify OAuth
 *     description: >
 *       Redirects the browser to Spotify's authorization page. Pass an
 *       existing session token as ?token= to link Spotify to that account;
 *       omit it to sign up / log in via Spotify.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to Spotify's authorization page.
 *       500:
 *         description: Spotify login is not configured.
 */
router.get("/spotify/login", OAuthController.spotifyLogin);

/**
 * @openapi
 * /api/v1/oauth/spotify/callback:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Spotify OAuth redirect target
 *     description: >
 *       Exchanges the authorization code for tokens, links or creates a
 *       BobaBlend account, and redirects back to the frontend with a
 *       session token.
 *     responses:
 *       302:
 *         description: Redirect back to the frontend.
 */
router.get("/spotify/callback", OAuthController.spotifyCallback);

module.exports = router;
