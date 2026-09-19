const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authMiddleware");
const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

router.get("/",authmiddleware, getNotifications);

router.patch("/:id/read",authmiddleware, markAsRead);

router.patch("/read-all", authmiddleware, markAllAsRead);

module.exports = router;