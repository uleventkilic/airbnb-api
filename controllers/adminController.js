const Listing = require("../models/Listing");

exports.listListingsWithPaging = async (req, res) => {
  try {
    const { country, city, page = 1, limit = 10 } = req.query;

    const filters = {
      ...(country && { country }),
      ...(city && { city }),
    };

    const total = await Listing.countDocuments(filters);
    const listings = await Listing.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ averageRating: -1 }); // Sort by rating if available

    res.status(200).json({
      status: "success",
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      data: listings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
