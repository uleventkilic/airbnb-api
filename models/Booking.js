const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  dateFrom: {
    type: String,
    required: true,
  },
  dateTo: {
    type: String,
    required: true,
  },
  namesOfPeople: {
    type: [String], // Array of strings
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
