const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "blogapp",
});

connection.connect().then(() => console.log("Connected Successfully!"));

app.post("/api/v1/add-post", async (req, res) => {
  const { blog_title, blog_content } = req.body;

  try {
    const insert_query =
      "INSERT INTO blogs (blog_title, blog_content) VALUES ($1,$2) RETURNING *";

    const result = await connection.query(insert_query, [
      blog_title,
      blog_content,
    ]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/all-posts", async (req, res) => {
  try {
    const fetch_query = "SELECT * FROM blogs";

    const result = await connection.query(fetch_query);
    res.status(200).json(result.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/all-posts/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const fetchById_query = "SELECT * FROM blogs WHERE blog_id=$1";

    const result = await connection.query(fetchById_query, [id]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/v1/update-posts/:id", async (req, res) => {
  const id = req.params.id;
  const { blog_title, blog_content } = req.body;

  try {
    const update_query =
      "UPDATE blogs SET blog_title=$1, blog_content=$2 WHERE blog_id=$3  RETURNING *";

    const result = await connection.query(update_query, [
      blog_title,
      blog_content,
      id,
    ]);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/v1/delete-posts/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const delete_query = "DELETE FROM blogs WHERE blog_id=$1";

    const result = await connection.query(delete_query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
