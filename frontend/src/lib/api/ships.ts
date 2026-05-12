
import api from "../api";

export const shipsApi = {
  getAll: async () => {
    try {
      const response = await api.get("/ships");
      return response.data;
    } catch (error) {
      console.error("Error fetching ships:", error);
      throw error;
    }
  },
};
