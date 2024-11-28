const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Veritabanına bağlanıldı...");

    const users = [
      {
        username: "admin",
        email: "admin@example.com",
        password: "admin123", 
        role: "admin",
      },
      {
        username: "host",
        email: "host@example.com",
        password: "host123", 
        role: "host",
      },
      {
        username: "guest",
        email: "guest@example.com",
        password: "guest123", 
        role: "guest",
      },
      {
        username: "John Doe",
        email: "johndoe@example.com",
        password: "guest123", 
        role: "guest",
      },
      {
        username: "Jane Smith",
        email: "janesmith@example.com",
        password: "guest123", 
        role: "guest",
      },
    ];

    await User.deleteMany();
    console.log("Mevcut kullanıcılar silindi.");

    const createdUsers = await User.insertMany(users);
    console.log("Kullanıcılar başarıyla eklendi:", createdUsers);

    mongoose.connection.close();
    console.log("Veritabanı bağlantısı kapatıldı.");
  } catch (err) {
    console.error("Hata oluştu:", err.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();
