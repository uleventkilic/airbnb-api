const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Erişim engellendi! Token bulunamadı." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgilerini istek objesine ekle
    next();
  } catch (err) {
    res.status(401).json({ message: "Geçersiz token." });
  }
};

module.exports = authMiddleware;
