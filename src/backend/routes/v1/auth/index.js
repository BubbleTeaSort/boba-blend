const express = require("express");

const AuthController = require("../../../controllers/auth_controller");

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new user account
 *     description: Registers a new user account with a pending verification status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - handle
 *               - password
 *             properties:
 *               handle:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 example: riri
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securePassword123
 *               displayName:
 *                 type: string
 *                 maxLength: 32
 *                 example: Riri
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Session token used for authentication.
 *       400:
 *         description: Invalid request data.
 *       409:
 *         description: Handle is already taken.
 *       500:
 *         description: Internal server error.
 */
router.post("/signup", AuthController.signup);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user
 *     description: Authenticates a user using their handle and password and creates a new session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - handle
 *               - password
 *             properties:
 *               handle:
 *                 type: string
 *                 example: riri
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Session token used for authentication.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid handle or password.
 *       403:
 *         description: Account is unavailable.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", AuthController.login);

module.exports = router;