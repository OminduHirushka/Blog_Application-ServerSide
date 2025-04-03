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
