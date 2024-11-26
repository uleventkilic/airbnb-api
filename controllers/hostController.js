const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

exports.insertListing = async (req, res) => {
  try {
    const { noOfPeople, country, city, price } = req.body;

    const newListing = new Listing({ noOfPeople, country, city, price });
    await newListing.save();

    res.status(201).json({
      status: "success",
      message: "Listing created successfully",
      data: newListing,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getFilteredListings = async (req, res) => {
  try {
    const { country, city, noOfPeople, minPrice, maxPrice } = req.query;

    let filters = {};

    if (country) filters.country = country;
    if (city) filters.city = city;
    if (noOfPeople) filters.noOfPeople = { $gte: parseInt(noOfPeople) };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    const listings = await Listing.find(filters);

    res.status(200).json({
      status: "success",
      data: listings,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.bookStay = async (req, res) => {
  try {
    const { listingId, userId, dateFrom, dateTo } = req.body;

    const conflictingBooking = await Booking.findOne({
      listingId,
      $or: [
        { dateFrom: { $lte: dateTo, $gte: dateFrom } },
        { dateTo: { $gte: dateFrom, $lte: dateTo } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        status: "error",
        message: "Bu tarihlerde zaten rezervasyon mevcut.",
      });
    }

    const newBooking = new Booking({
      listingId,
      userId,
      dateFrom,
      dateTo,
    });

    await newBooking.save();

    res.status(201).json({
      status: "success",
      message: "Rezervasyon başarıyla oluşturuldu",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { listingId, userId, rating, comment } = req.body;

    const existingBooking = await Booking.findOne({ listingId, userId });

    if (!existingBooking) {
      return res.status(400).json({
        status: "error",
        message: "Bu liste için rezervasyon yapılmadığı için yorum bırakılamaz.",
      });
    }

    const newReview = new Review({ listingId, userId, rating, comment });
    await newReview.save();

    res.status(201).json({
      status: "success",
      message: "Yorum başarıyla eklendi",
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getReviewsByListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const reviews = await Review.find({ listingId });

    res.status(200).json({
      status: "success",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.reportListings = async (req, res) => {
  try {
    const { minRating } = req.query;

    let filters = {};
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }

    const listings = await Listing.find(filters).sort({ rating: -1 });

    res.status(200).json({
      status: "success",
      data: listings,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
