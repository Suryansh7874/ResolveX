const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createHEI,
  getHEIs,
} = require("../controllers/heiController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HEI_ADMIN"),
  createHEI
);

router.get("/", getHEIs);

module.exports = router;