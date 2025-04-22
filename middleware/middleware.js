const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

exports.isCustomer = (req, res, next) => {
  if (!req.user || req.user.type !== "customer") {
    return res.status(403).json({ error: "Customer access required" });
  }
  next();
};
