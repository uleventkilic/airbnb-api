const express = require("express");
const router = express.Router();
const { verifyToken, isHost } = require("../middleware/authMiddleware");
const { addListing } = require("../controllers/hostController");

/**
 * @swagger
 * /hosts/listings:
 *   post:
 *     summary: Yeni ilan ekleme (Sadece Host)
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
 *         description: İlan başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing successfully added"
 *       401:
 *         description: Token doğrulama başarısız
 *       403:
 *         description: Host yetkisi gerekli
 */
router.post("/listings", verifyToken, isHost, addListing);

module.exports = router;
