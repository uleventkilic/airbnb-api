const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);

module.exports = router;
