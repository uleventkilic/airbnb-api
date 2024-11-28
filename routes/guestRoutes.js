const express = require("express");
const router = express.Router();
const { verifyToken, isGuest } = require("../middleware/authMiddleware");
const { listListings, bookStay, addReview } = require("../controllers/guestController");

/**
 * @swagger
 * /guests/listings:
 *   get:
 *     summary: İlanları listeleme
 *     description: Tarih ve kişi bilgilerine göre ilanları listeler.
 *     tags: [Guest]
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *         description: Başlangıç tarihi
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-07"
 *         description: Bitiş tarihi
 *       - in: query
 *         name: namesOfPeople
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         example: ["John Doe", "Jane Smith"]
 *         description: Kişi isimleri
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         description: Her sayfada gösterilecek ilan sayısı
 *     responses:
 *       200:
 *         description: Başarılı
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
 *         description: Sunucu hatası
 */
router.get("/listings", listListings);

/**
 * @swagger
 * /guests/bookings:
 *   post:
 *     summary: Rezervasyon yapma
 *     description: Giriş yapan misafirler için rezervasyon yapar.
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
 *         description: Rezervasyon başarıyla yapıldı
 *       401:
 *         description: Token doğrulama başarısız
 *       500:
 *         description: Sunucu hatası
 */
router.post("/bookings", verifyToken, isGuest, bookStay);

/**
 * @swagger
 * /guests/reviews:
 *   post:
 *     summary: Yorum ekleme
 *     description: Sadece rezervasyon yapmış kullanıcılar yorum yapabilir.
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
 *         description: Yorum başarıyla eklendi
 *       400:
 *         description: Eksik veya hatalı parametreler
 *       403:
 *         description: Yalnızca rezervasyon yapan kullanıcılar yorum yapabilir
 *       500:
 *         description: Sunucu hatası
 */
router.post("/reviews", verifyToken, isGuest, addReview);

module.exports = router;
