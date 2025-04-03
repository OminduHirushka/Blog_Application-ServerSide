const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connection = require("../config/db");

dotenv.config();

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;

  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const userExists = await connection.query(checkUserQuery, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, type) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, type
    `;

    const result = await connection.query(insertQuery, [
      firstName,
      lastName,
      email,
      passwordHash,
      type || "customer",
    ]);

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const result = await connection.query(findUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      type: user.type,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "48h",
    });

    const userResponse = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      type: user.type,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
    return res
      .status(403)
      .json({ error: "Customer access required" });
  }
  next();
};
