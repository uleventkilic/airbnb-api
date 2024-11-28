const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const User = require("./models/User"); // Kullanıcı modelini içe aktar

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb API",
      version: "1.0.0",
      description: "API documentation for an Airbnb-like application",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1", // Local URL
      },
      {
        url: "https://airbnb-api-77ly.onrender.com/api/v1", // Render URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Use route files for Swagger documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI at `/api/v1/docs`
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Seed Users
const seedUsers = async () => {
  const users = [
    {
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "host@example.com",
      password: "host123",
      role: "host",
    },
    {
      email: "guest@example.com",
      password: "guest123",
      role: "guest",
    },
  ];

  for (let user of users) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      const newUser = new User(user);
      await newUser.save();
      console.log(`User created: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }
};

// Route Connections
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/hosts", require("./routes/hostRoutes"));
app.use("/api/v1/guests", require("./routes/guestRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "API is running successfully!" });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  seedUsers(); // Kullanıcıları oluştur
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
