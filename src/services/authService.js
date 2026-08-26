import api from "./api";

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  const { token, user } = response.data;

  // Save authentication information
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin test
export const adminTest = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/auth/admin-test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};