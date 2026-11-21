import api from "./api";

// Get all registered HEIs
export const getHEIs = async () => {
  const response = await api.get("/hei");
  return response.data;
};

// Register a new HEI
export const createHEI = async (payload) => {
  const response = await api.post("/hei", payload);
  return response.data;
};

// Create an HEI Admin account
export const createHEIAdmin = async (payload) => {
  const response = await api.post("/users/create-managed-user", {
    ...payload,
    role: "HEI_ADMIN",
  });

  return response.data;
};