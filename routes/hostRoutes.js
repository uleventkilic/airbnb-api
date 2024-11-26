const express = require("express");
const router = express.Router();
const { 
  insertListing, 
  getFilteredListings, 
  bookStay, 
  addReview, 
  getReviewsByListing, 
  reportListings 
} = require("../controllers/hostController");

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: Ev sahipleriyle ilgili işlemler
 */

/**
 * @swagger
 * /hosts/listings:
 *   post:
 *     summary: Yeni bir liste ekle
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noOfPeople:
 *                 type: integer
 *                 example: 4
 *               country:
 *                 type: string
 *                 example: Turkey
 *               city:
 *                 type: string
 *                 example: Istanbul
 *               price:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Liste başarıyla oluşturuldu
 */
router.post("/listings", insertListing);

/**
 * @swagger
 * /hosts/listings:
 *   get:
 *     summary: Listeleri ara ve filtrele
 *     tags: [Hosts]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Ülkeye göre filtreleme
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Şehre göre filtreleme
 *       - in: query
 *         name: noOfPeople
 *         schema:
 *           type: integer
 *         description: Kişi sayısına göre filtreleme
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum fiyat
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maksimum fiyat
 *     responses:
 *       200:
 *         description: Filtrelenmiş listeler
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   noOfPeople:
 *                     type: integer
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get("/listings", getFilteredListings);

/**
 * @swagger
 * /hosts/bookings:
 *   post:
 *     summary: Rezervasyon yap
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingId:
 *                 type: string
 *                 example: "63b04ff3e14e6f00123abcde"
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-28"
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Rezervasyon başarıyla oluşturuldu
 */
router.post("/bookings", bookStay);

/**
 * @swagger
 * /hosts/reviews:
 *   post:
 *     summary: Listeye yorum ekle
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingId:
 *                 type: string
 *                 example: "63b04ff3e14e6f00123abcde"
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Çok güzel bir konaklamaydı!"
 *     responses:
 *       201:
 *         description: Yorum başarıyla eklendi
 */
router.post("/reviews", addReview);

/**
 * @swagger
 * /hosts/reviews/{listingId}:
 *   get:
 *     summary: Bir listeye yapılan yorumları getir
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Liste ID'si
 *     responses:
 *       200:
 *         description: Yorumlar başarıyla alındı
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 */
router.get("/reviews/:listingId", getReviewsByListing);

/**
 * @swagger
 * /hosts/listings/report:
 *   get:
 *     summary: Puanlarına göre liste raporu oluştur
 *     tags: [Hosts]
 *     parameters:
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           description: Minimum puanı belirler (isteğe bağlı)
 *     responses:
 *       200:
 *         description: Puanlara göre sıralanmış liste raporu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   noOfPeople:
 *                     type: integer
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   price:
 *                     type: number
 *                   rating:
 *                     type: number
 */
router.get("/listings/report", reportListings);

module.exports = router;
