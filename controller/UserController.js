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

exports.updateUser = async (req, res) => {
  const requestedEmail = req.params.email;
  const { firstName, lastName, password } = req.body;

  if (req.user.email !== requestedEmail && req.user.type !== "admin") {
    return res.status(403).json({
      error: "You can only update your own data",
    });
  }

  try {
    let update_query;
    let queryParams;

    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10);
      update_query = `
          UPDATE users 
          SET first_name = $1, last_name = $2, password = $3 
          WHERE email = $4 
          RETURNING id, first_name, last_name, email
        `;
      queryParams = [firstName, lastName, passwordHash, requestedEmail];
    } else {
      update_query = `
          UPDATE users 
          SET first_name = $1, last_name = $2 
          WHERE email = $3 
          RETURNING id, first_name, last_name, email
        `;
      queryParams = [firstName, lastName, requestedEmail];
    }

    const result = await connection.query(update_query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        email: requestedEmail,
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      result: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const checkUserQuery = "SELECT email FROM users WHERE email = $1";
    const userCheck = await connection.query(checkUserQuery, [userEmail]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        email: userEmail,
      });
    }

    if (req.user.email === userEmail) {
      return res.status(403).json({
        message: "Admins can't delete their own accounts",
      });
    }

    const delete_query = "DELETE FROM users WHERE email = $1 RETURNING email";
    const result = await connection.query(delete_query, [userEmail]);

    res.status(200).json({
      message: "User deleted successfully",
      email: result.rows[0].email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  const userEmail = req.user.email;

  try {
    if (!req.user?.email) {
      return res.status(400).json({ error: "Invalid user data in token" });
    }

    const result = await connection.query(
      "SELECT id, first_name, last_name, email, type FROM users WHERE email = $1",
      [userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Successful",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
