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

