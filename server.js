const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Swagger Ayarları
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb API",
      version: "1.0.0",
      description: "API Documentation for Airbnb-like application",
    },
    servers: [
      {
        url: "https://airbnb-api-77ly.onrender.com/api/v1", // Render URL
      },
      {
        url: "http://localhost:5000/api/v1", // Lokal URL
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
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger'ı "/api/v1" altında çalıştır
app.use("/api/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota Bağlantıları
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/hosts", require("./routes/hostRoutes"));
app.use("/api/v1/guests", require("./routes/guestRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Rota bulunamadı" });
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
