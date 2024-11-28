const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { queryListings, bookStay, addReview } = require("../controllers/guestController");

const router = express.Router();

/**
 * @swagger
 * /guests/listings:
 *   get:
 *     summary: Query listings by availability
 *     description: Lists only the available listings for the specified date range.
 *     tags: [Guest]
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *         description: Start date for the search
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-05"
 *         description: End date for the search
 *       - in: query
 *         name: noOfPeople
 *         schema:
 *           type: integer
 *         example: 2
 *         description: Minimum number of people the listing should accommodate
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         example: "Turkey"
 *         description: Filter listings by country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: "Istanbul"
 *         description: Filter listings by city
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
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
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/listings", queryListings);

/**
 * @swagger
 * /guests/bookings:
 *   post:
 *     summary: Book a stay
 *     description: Allows guests to book a stay for a specific listing.
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
 *               - listingId
 *               - dateFrom
 *               - dateTo
 *               - namesOfPeople
 *             properties:
 *               listingId:
 *                 type: string
 *                 description: The ID of the listing to book
 *                 example: "64f2b8c8f1c84900123abcde"
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-05"
 *               namesOfPeople:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["John Doe", "Jane Smith"]
 *     responses:
 *       201:
 *         description: Booking successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking successfully created
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.post("/bookings", verifyToken, bookStay);

/**
 * @swagger
 * /guests/reviews:
 *   post:
 *     summary: Add a review
 *     description: Allows guests to add a review for a stay they have booked.
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
 *               - bookingId
 *               - rating
 *               - comment
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: The ID of the booking to review
 *                 example: "64f2b8c8f1c84900123abcde"
 *               rating:
 *                 type: number
 *                 description: The rating for the stay
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: The comment for the review
 *                 example: "The stay was fantastic!"
 *     responses:
 *       201:
 *         description: Review successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review successfully added
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing or invalid parameters
 *       403:
 *         description: Booking not found or does not belong to the user
 *       500:
 *         description: Server error
 */
router.post("/reviews", verifyToken, addReview);

module.exports = router;
