const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createDepartment,
  getDepartments,
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/",authMiddleware, roleMiddleware("ADMIN"), createDepartment);

router.get("/", getDepartments);

module.exports = router;