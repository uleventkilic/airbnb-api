const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// Query Listings - Filter by availability
exports.queryListings = async (req, res) => {
  try {
    const { dateFrom, dateTo, noOfPeople, country, city, page = 1, limit = 10 } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ message: "Both 'dateFrom' and 'dateTo' are required" });
    }

    const filters = {
      ...(country && { country }),
      ...(city && { city }),
      ...(noOfPeople && { noOfPeople: { $gte: parseInt(noOfPeople) } }),
    };

    // Find booked listings within the date range
    const bookedListings = await Booking.find({
      $or: [
        { dateFrom: { $lt: new Date(dateTo) }, dateTo: { $gte: new Date(dateFrom) } },
      ],
    }).distinct("listingId");

    // Find available listings
    const availableListings = await Listing.find({
      ...filters,
      _id: { $nin: bookedListings },
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalResults = await Listing.countDocuments({
      ...filters,
      _id: { $nin: bookedListings },
    });

    res.status(200).json({
      status: "success",
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      data: availableListings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book a stay
exports.bookStay = async (req, res) => {
  try {
    const { listingId, dateFrom, dateTo, namesOfPeople } = req.body;

    if (!listingId || !dateFrom || !dateTo || !namesOfPeople || !Array.isArray(namesOfPeople)) {
      return res.status(400).json({
        message: "All fields are required, and 'namesOfPeople' must be an array",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const booking = new Booking({
      listingId,
      dateFrom,
      dateTo,
      namesOfPeople,
      userId: req.user.id, // From token
    });

    await booking.save();
    res.status(201).json({ message: "Booking successfully created", data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the booking exists and belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, userId: req.user.id });
    if (!booking) {
      return res.status(403).json({
        message: "You can only review a stay you have booked",
      });
    }

    const review = new Review({
      stayId: booking.listingId, // Link to the listing
      rating,
      comment,
      userId: req.user.id, // From token
    });

    await review.save();
    res.status(201).json({ message: "Review successfully added", data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
