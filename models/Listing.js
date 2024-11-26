const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  noOfPeople: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Listing", ListingSchema);
