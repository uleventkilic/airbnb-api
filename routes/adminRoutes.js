const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { listListingsWithPaging } = require("../controllers/adminController");

/**
 * @swagger
 * /admin/listings:
 *   get:
 *     summary: List and filter listings
 *     description: Lists listings filtered by country and city information.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         example: "Turkey"
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: "Istanbul"
 *         description: Filter by city
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         description: Number of listings per page
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get("/listings", verifyToken, isAdmin, listListingsWithPaging);

module.exports = router;
