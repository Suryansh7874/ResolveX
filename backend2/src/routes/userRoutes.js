const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createManagedUser,
} = require("../controllers/userController");

const router = express.Router();


// =====================================================
// ADMIN Creates HEI / INDUSTRY ACCOUNTS
// =====================================================

router.post(
  "/create-managed-user",
  authMiddleware,
  roleMiddleware("GOVERNMENT"),
  createManagedUser
);




module.exports = router;