const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/middleware");

const postController = require("../controller/PostController");

router.post("/add-post", authenticateToken, postController.createPost);
router.get("/all-posts", postController.getAllPosts);
router.get("/all-posts/:id", postController.getPostById);
router.get("/user-posts/:email", authenticateToken, postController.findPostsByUserEmail);
router.put("/update-posts/:id", authenticateToken, postController.updatePost);
router.delete("/delete-posts/:id", authenticateToken, postController.deletePost);

module.exports = router;
