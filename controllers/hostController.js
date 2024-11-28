const Listing = require("../models/Listing");

exports.addListing = async (req, res) => {
  try {
    const { noOfPeople, country, city, price } = req.body;

    if (!noOfPeople || !country || !city || !price) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır" });
    }

    const newListing = new Listing({
      noOfPeople,
      country,
      city,
      price,
      host: req.user.id, // Token'dan gelen kullanıcı ID'si
    });

    await newListing.save();
    res.status(201).json({ message: "Listing successfully added", data: newListing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
