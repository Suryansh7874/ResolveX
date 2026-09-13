import api from "./api";

// Get notifications for the logged-in user
export const getNotifications = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    return {
      count: 0,
      notifications: [],
    };
  }

  const response = await api.get("/notifications", {
    params: {
      userId: user.id,
    },
  });

  return response.data;
};


// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};