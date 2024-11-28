const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful");

    const users = [
      { email: "admin@example.com", password: "admin123", role: "admin" },
      { email: "host@example.com", password: "host123", role: "host" },
      { email: "guest@example.com", password: "guest123", role: "guest" },
    ];

    await User.insertMany(users);
    console.log("Users added successfully");

    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

seedUsers();
