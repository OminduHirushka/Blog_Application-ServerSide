const connection = require("../config/db");

exports.createPost = async (req, res) => {
  const { blog_title, blog_content } = req.body;

  try {
    const insert_query =
      "INSERT INTO blogs (blog_title, blog_content, user_id, user_email) VALUES ($1, $2, $3, $4) RETURNING *";

    const result = await connection.query(insert_query, [
      blog_title,
      blog_content,
      req.user.id,
      req.user.email
    ]);

    res.status(200).json({
      message: "Post created successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const fetch_query = "SELECT blog_title, blog_content, created_at, user_email FROM blogs";

    const result = await connection.query(fetch_query);

    res.status(200).json({
      message: "Successful",
      posts: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  const id = req.params.id;

  try {
    const fetchById_query =
      "SELECT b.*, u.first_name, u.last_name, u.email FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.blog_id = $1";

    const result = await connection.query(fetchById_query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.findPostsByUserEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const fetchById_query =
      "SELECT b.*, u.email FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.user_email = $1";

    const result = await connection.query(fetchById_query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      post: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const { blog_title, blog_content } = req.body;

  try {
    const getQuery = "SELECT * FROM blogs WHERE blog_id = $1";
    const postResult = await connection.query(getQuery, [id]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = postResult.rows[0];

    if (req.user.id !== post.user_id && req.user.type !== "admin") {
      return res.status(403).json({
        error: "You can only update your own posts",
      });
    }

    const update_query =
      "UPDATE blogs SET blog_title = $1, blog_content = $2 WHERE blog_id = $3 RETURNING *";

    const result = await connection.query(update_query, [
      blog_title,
      blog_content,
      id,
    ]);

    res.status(200).json({
      message: "Post updated successfully",
      post: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM blogs WHERE blog_id = $1";
    const result_query = await connection.query(query, [id]);

    if (result_query.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (req.user.id !== result_query.rows[0].user_id) {
      return res.status(403).json({
        error: "You can only delete your own posts",
      });
    }

    const delete_query =
      "DELETE FROM blogs WHERE blog_id = $1 RETURNING blog_id";
    const result = await connection.query(delete_query, [id]);

    res.status(200).json({
      message: "Post deleted successfully",
      post_id: result.rows[0].blog_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
