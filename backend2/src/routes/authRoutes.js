const express = require("express");

const {
  register,
  login,
  getMe,
  adminTest,
  forgotPasswordController,
  verifyResetOTPController,
  resetPasswordController,
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

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/verify-reset-otp",
  verifyResetOTPController
);

router.post(
  "/reset-password",
  resetPasswordController
);

module.exports = router;