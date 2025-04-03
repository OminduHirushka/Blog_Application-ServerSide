const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../controller/AuthController");

const userContrtoller = require("../controller/UserController");

router.get("/all-users", authenticateToken, isAdmin, userContrtoller.getAllUsers);
router.get("/:email", authenticateToken, userContrtoller.getUserByEmail);
router.put("/update-user/:email", authenticateToken, userContrtoller.updateUser);
router.delete("/delete-user/:email", authenticateToken, isAdmin, userContrtoller.deleteUser);

module.exports = router;
