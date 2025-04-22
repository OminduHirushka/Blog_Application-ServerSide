const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/middleware");

const userContrtoller = require("../controller/UserController");

router.get("/all-users", authenticateToken, isAdmin, userContrtoller.getAllUsers);
router.get("/all-users/:email", authenticateToken, userContrtoller.getUserByEmail);
router.put("/update-user/:email", authenticateToken, userContrtoller.updateUser);
router.delete("/delete-user/:email", authenticateToken, isAdmin, userContrtoller.deleteUser);
router.get("/me", authenticateToken, userContrtoller.getCurrentUser);

module.exports = router;
