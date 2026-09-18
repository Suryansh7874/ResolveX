// utils/createNotification.js
const Notification = require("../models/Notification");

/**
 * Utility to save a notification directly to MongoDB
 */
const createNotification = async ({
  userId,
  type,
  message,
  challengeId = null,
  proposalId = null,
  projectId = null,
}) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      challengeId,
      proposalId,
      projectId,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = createNotification;