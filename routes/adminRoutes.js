const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { listListingsWithRatings } = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * /admin/listings:
 *   get:
 *     summary: List listings with ratings
 *     description: Lists all listings along with their ratings for admins.
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
 *                     properties:
 *                       _id:
 *                         type: string
 *                       noOfPeople:
 *                         type: integer
 *                       country:
 *                         type: string
 *                       city:
 *                         type: string
 *                       price:
 *                         type: number
 *                       averageRating:
 *                         type: number
 *                       totalReviews:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/listings", verifyToken, isAdmin, listListingsWithRatings);

module.exports = router;
