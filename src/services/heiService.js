import api from "./api";

export const getHEIs = async () => {
  const response = await api.get("/hei");
  return response.data;
};

export const createHEI = async (payload) => {
  const response = await api.post("/hei", payload);
  return response.data;
};

export const createHEIAdmin = async (payload) => {
  const response = await api.post("/users/create-managed-user", {
    ...payload,
    role: "HEI_ADMIN",
  });
  return response.data;
};
