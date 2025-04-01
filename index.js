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

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
