const express = require("express");
const router = express.Router();
const { verifyToken, isGuest } = require("../middleware/authMiddleware");
const { listListings, bookStay, addReview } = require("../controllers/guestController");

/**
 * @swagger
 * /guests/listings:
 *   get:
 *     summary: List properties
 *     description: Lists properties based on date, location, and number of people.
 *     tags: [Guest]
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *         description: Start date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-07"
 *         description: End date
 *       - in: query
 *         name: noOfPeople
 *         schema:
 *           type: integer
 *         example: 3
 *         description: Number of people
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         example: "Turkey"
 *         description: Country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: "Istanbul"
 *         description: City
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
 *       500:
 *         description: Server error
 */
router.get("/listings", listListings);

/**
 * @swagger
 * /guests/bookings:
 *   post:
 *     summary: Make a booking
 *     description: Allows logged-in guests to make a booking.
 *     tags: [Guest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dateFrom
 *               - dateTo
 *               - namesOfPeople
 *             properties:
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-07"
 *               namesOfPeople:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["John Doe", "Jane Smith"]
 *     responses:
 *       201:
 *         description: Booking successfully created
 *       401:
 *         description: Token verification failed
 *       500:
 *         description: Server error
 */
router.post("/bookings", verifyToken, isGuest, bookStay);

/**
 * @swagger
 * /guests/reviews:
 *   post:
 *     summary: Add a review
 *     description: Only users who have made a booking can add a review.
 *     tags: [Guest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stayId
 *               - rating
 *               - comment
 *             properties:
 *               stayId:
 *                 type: string
 *                 example: "64f2b8c8f1c84900123abcde"
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "It was an amazing stay!"
 *     responses:
 *       201:
 *         description: Review successfully added
 *       400:
 *         description: Missing or invalid parameters
 *       403:
 *         description: Only users who made a booking can leave a review
 *       500:
 *         description: Server error
 */
router.post("/reviews", verifyToken, isGuest, addReview);

module.exports = router;
