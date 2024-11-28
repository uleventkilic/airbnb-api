const express = require("express");
const router = express.Router();
const { verifyToken, isHost } = require("../middleware/authMiddleware");
const { addListing } = require("../controllers/hostController");

/**
 * @swagger
 * /hosts/listings:
 *   post:
 *     summary: Add a new listing (Host only)
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noOfPeople
 *               - country
 *               - city
 *               - price
 *             properties:
 *               noOfPeople:
 *                 type: number
 *                 example: 4
 *               country:
 *                 type: string
 *                 example: "Turkey"
 *               city:
 *                 type: string
 *                 example: "Istanbul"
 *               price:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Listing successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing successfully added"
 *       401:
 *         description: Token verification failed
 *       403:
 *         description: Host privileges required
 */
router.post("/listings", verifyToken, isHost, addListing);

module.exports = router;
