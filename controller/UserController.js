const bcrypt = require("bcrypt");
const connection = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const query = "SELECT id, first_name, last_name, email, type FROM users";

    const result = await connection.query(query);
    res.status(200).json({
      message: "Successful",
      list: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserByEmail = async (req, res) => {
  const requestedEmail = req.params.email;

  if (req.user.email !== requestedEmail && req.user.type !== "admin") {
    return res.status(403).json({
      error: "You can only access your own data",
    });
  }

  try {
    const query =
      "SELECT id, first_name, last_name, email, type FROM users WHERE email = $1";
    const result = await connection.query(query, [requestedEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
