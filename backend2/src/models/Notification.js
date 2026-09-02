const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            "issue_created",
            "status_updated",
            "issue_resolved"
        ],
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);