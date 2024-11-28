const Listing = require("../models/Listing");
const Review = require("../models/Review");

exports.listListingsWithRatings = async (req, res) => {
  try {
    const { country, city, page = 1, limit = 10 } = req.query;

    const filters = {
      ...(country && { country }),
      ...(city && { city }),
    };

    // Filter all listings
    const total = await Listing.countDocuments(filters);
    const listings = await Listing.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate rating information for each listing
    const listingsWithRatings = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await Review.find({ stayId: listing._id });
        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        return {
          ...listing.toObject(),
          averageRating: parseFloat(averageRating.toFixed(2)),
          totalReviews,
        };
      })
    );

    res.status(200).json({
      status: "success",
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      data: listingsWithRatings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
