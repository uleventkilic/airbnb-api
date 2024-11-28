const Listing = require("../models/Listing");

exports.addListing = async (req, res) => {
  try {
    const { noOfPeople, country, city, price } = req.body;

    if (!noOfPeople || !country || !city || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newListing = new Listing({
      noOfPeople,
      country,
      city,
      price,
      host: req.user.id, // User ID from the token
    });

    await newListing.save();
    res.status(201).json({ message: "Listing successfully added", data: newListing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
