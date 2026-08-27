const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {

    try {
        const { userId } = req.query;
        const notifications = await Notification.find({
            userId: userId
        }).sort({createdAt:-1});

        res.status(200).json({
            count: notifications.length,
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};


const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }
        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead
};