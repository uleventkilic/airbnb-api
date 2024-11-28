const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlantısı başarılı");

    const users = [
      { email: "admin@example.com", password: "admin123", role: "admin" },
      { email: "host@example.com", password: "host123", role: "host" },
      { email: "guest@example.com", password: "guest123", role: "guest" },
    ];

    await User.insertMany(users);
    console.log("Kullanıcılar başarıyla eklendi");

    process.exit();
  } catch (err) {
    console.error("Hata:", err.message);
    process.exit(1);
  }
};

seedUsers();
