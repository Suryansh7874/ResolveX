const express = require("express");

const {
  register,
  login,
  getMe,
  adminTest,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminTest
);

module.exports = router;