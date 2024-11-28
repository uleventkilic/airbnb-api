const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

exports.isHost = (req, res, next) => {
  if (req.user.role !== "host") {
    return res.status(403).json({ message: "Host privileges required" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required" });
  }
  next();
};

exports.isGuest = (req, res, next) => {
  if (req.user.role !== "guest") {
    return res.status(403).json({ message: "Guest privileges required" });
  }
  next();
};
