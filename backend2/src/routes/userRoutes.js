const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createManagedUser,
} = require("../controllers/userController");

const router = express.Router();


// =====================================================
// ADMIN CREATES GOVERNMENT / HEI / INDUSTRY ACCOUNTS
// =====================================================

router.post(
  "/create-managed-user",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createManagedUser
);




module.exports = router;