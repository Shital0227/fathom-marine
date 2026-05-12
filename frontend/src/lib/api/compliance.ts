
import api from '../api';

export const complianceApi = {
  getAll: async () => {
    const response = await api.get('/compliance');
    return response.data;
  },

  getByShipId: async (shipId: string) => {
    const response = await api.get(`/compliance/${shipId}`);
    return response.data;
  },

  getHistory: async (shipId: string) => {
    const response = await api.get(`/compliance/${shipId}/history`);
    return response.data;
  },

  takeSnapshot: async (shipId: string) => {
    const response = await api.post(`/compliance/${shipId}/snapshot`);
    return response.data;
  },
};