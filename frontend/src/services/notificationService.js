import api from "./api";

// Get notifications for the logged-in user
export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};