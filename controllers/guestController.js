const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// Listing properties (Listing with filters)
exports.listListings = async (req, res) => {
  try {
    const { dateFrom, dateTo, noOfPeople, country, city } = req.query;

    const filters = {
      ...(country && { country }),
      ...(city && { city }),
    };

    const listings = await Listing.find(filters).lean();

    res.status(200).json({
      status: "success",
      data: listings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Booking a stay
exports.bookStay = async (req, res) => {
  try {
    const { dateFrom, dateTo, namesOfPeople } = req.body;

    if (!dateFrom || !dateTo || !namesOfPeople || !Array.isArray(namesOfPeople)) {
      return res.status(400).json({
        message: "All fields are required, and 'namesOfPeople' must be an array",
      });
    }

    const booking = new Booking({
      dateFrom,
      dateTo,
      namesOfPeople,
      userId: req.user.id, // User ID taken from the token
    });

    await booking.save();
    res.status(201).json({ message: "Booking successfully created", data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Adding a review
exports.addReview = async (req, res) => {
  try {
    const { stayId, rating, comment } = req.body;

    if (!stayId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user has made a booking for this stay
    const booking = await Booking.findOne({ _id: stayId, userId: req.user.id });
    if (!booking) {
      return res.status(403).json({
        message: "Only users who made a booking can leave a review",
      });
    }

    const review = new Review({
      stayId,
      rating,
      comment,
      userId: req.user.id,
    });

    await review.save();

    res.status(201).json({ message: "Review successfully added", data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
