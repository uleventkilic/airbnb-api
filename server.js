const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Çevresel değişkenleri yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

// Express uygulaması oluştur
const app = express();
app.use(bodyParser.json());

// Swagger Ayarları
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb API",
      version: "1.0.0",
      description: "Airbnb benzeri platform için API dokümantasyonu",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
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
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotaları bağla
app.use("/api/v1/hosts", require("./routes/hostRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Rota bulunamadı" });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
