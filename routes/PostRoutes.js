const express = require("express");
const router = express.Router();

const postController = require("../controller/PostController");
const authController = require("../controller/AuthController");

router.post("/add-post", authController.authenticateToken, postController.createPost);
router.get("/all-posts", postController.getAllPosts);
router.get("/all-posts/:id", postController.getPostById);
router.put("/update-posts/:id", authController.authenticateToken, postController.updatePost);
router.delete("/delete-posts/:id", authController.authenticateToken, postController.deletePost);

module.exports = router;
