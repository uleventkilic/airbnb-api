const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "*", // Tüm kaynaklara izin ver
    methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP metodları
    allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen başlıklar
  })
);

// JSON Middleware
app.use(express.json());

// Swagger Ayarları
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
        url: "http://localhost:5000/api/v1", // Lokal geliştirme için URL
      },
      {
        url: "https://airbnb-api-77ly.onrender.com/api/v1", // Render dağıtım URL'si
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
  apis: ["./routes/*.js"], // Swagger açıklamaları için rota dosyalarını kullan
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI Servisi `/api/v1/docs` üzerinden sağlanıyor
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota Bağlantıları
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/hosts", require("./routes/hostRoutes"));
app.use("/api/v1/guests", require("./routes/guestRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Sağlık Kontrolü Rotası
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "API is running successfully!" });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
