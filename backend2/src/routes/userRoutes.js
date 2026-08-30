const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {promoteToOfficer} = require("../controllers/userController");

const router = express.Router();

router.patch("/promote-officer", authMiddleware, roleMiddleware("ADMIN"), promoteToOfficer);

module.exports = router;