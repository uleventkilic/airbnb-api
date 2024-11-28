const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// İlanları Listeleme
exports.listListings = async (req, res) => {
  try {
    const { dateFrom, dateTo, namesOfPeople } = req.query;

    const filters = {
      ...(dateFrom && { dateFrom: { $gte: new Date(dateFrom) } }),
      ...(dateTo && { dateTo: { $lte: new Date(dateTo) } }),
    };

    const listings = await Listing.find(filters);

    res.status(200).json({
      status: "success",
      data: listings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rezervasyon Yapma
exports.bookStay = async (req, res) => {
  try {
    const { dateFrom, dateTo, namesOfPeople } = req.body;

    if (!dateFrom || !dateTo || !namesOfPeople || !Array.isArray(namesOfPeople)) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır ve 'namesOfPeople' bir dizi olmalıdır" });
    }

    const booking = new Booking({
      dateFrom,
      dateTo,
      namesOfPeople,
      userId: req.user.id, // Token'dan gelen kullanıcı ID'si
    });

    await booking.save();
    res.status(201).json({ message: "Rezervasyon başarıyla yapıldı", data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Yorum Ekleme
exports.addReview = async (req, res) => {
  try {
    const { stayId, rating, comment } = req.body;

    if (!stayId || !rating || !comment) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır" });
    }

    const booking = await Booking.findOne({ _id: stayId, userId: req.user.id });
    if (!booking) {
      return res
        .status(403)
        .json({ message: "Yalnızca rezervasyon yapan kullanıcılar yorum yapabilir" });
    }

    const review = new Review({
      stayId,
      rating,
      comment,
      userId: req.user.id,
    });

    await review.save();

    res.status(201).json({ message: "Yorum başarıyla eklendi", data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
