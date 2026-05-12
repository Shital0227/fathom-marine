import api from "../api";


export const drillsApi = {
  getAll: async (params?: { shipId?: string; status?: string }) => {
    const response = await api.get('/drills', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/drills/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    drillType: string;
    shipId: string;
    scheduledDate: string;
  }) => {
    const response = await api.post('/drills', data);
    return response.data;
  },

  markAttendance: async (drillId: string, attended: boolean) => {
    const response = await api.post(`/drills/${drillId}/attend`, { attended });
    return response.data;
  },

  updateStatus: async (drillId: string, status: 'scheduled' | 'completed' | 'missed') => {
    const response = await api.patch(`/drills/${drillId}/status`, { status });
    return response.data;
  },
};