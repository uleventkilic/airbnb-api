const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  noOfPeople: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0, // Average rating for the listing
  },
  totalReviews: {
    type: Number,
    default: 0, // Total number of reviews for the listing
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
