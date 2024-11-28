const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { listListingsWithPaging } = require("../controllers/adminController");

/**
 * @swagger
 * /admin/listings:
 *   get:
 *     summary: İlanları listeleme ve filtreleme
 *     description: İlanları ülke ve şehir bilgisine göre filtreleyerek listeler.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         example: "Turkey"
 *         description: Filtreleme için ülke
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: "Istanbul"
 *         description: Filtreleme için şehir
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
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get("/listings", verifyToken, isAdmin, listListingsWithPaging);

module.exports = router;
