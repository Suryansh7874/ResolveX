const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  registerHEIMember,
  getHEIMembers,
} = require("../controllers/heiMemberController");

const router = express.Router();

// HEI Admin can register faculty/student
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  registerHEIMember
);

// HEI Admin or Faculty can view members
router.get(
  "/:heiId",
  authMiddleware,
  roleMiddleware("HEI_ADMIN", "FACULTY"),
  getHEIMembers
);

module.exports = router;