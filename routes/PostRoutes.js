const express = require("express");
const router = express.Router();

const postController = require("../controller/PostController");

router.post("/add-post", postController.createPost);
router.get("/all-posts", postController.getAllPosts);
router.get("/all-posts/:id", postController.getPostById);
router.put("/update-posts/:id", postController.updatePost);
router.delete("/delete-posts/:id", postController.deletePost);

module.exports = router;
