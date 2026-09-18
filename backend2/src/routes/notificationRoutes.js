const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

router.get("/", getNotifications);

router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;