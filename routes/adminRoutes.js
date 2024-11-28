const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { listListingsWithPagingAndRatings } = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * /admin/report-listings:
 *   get:
 *     summary: List and filter listings with paging and rating
 *     description: Lists listings filtered by country, city, and minimum rating with paging.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           default: 0
 *         description: Minimum rating to filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of listings per page
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/report-listings", verifyToken, isAdmin, listListingsWithPagingAndRatings);

module.exports = router;
