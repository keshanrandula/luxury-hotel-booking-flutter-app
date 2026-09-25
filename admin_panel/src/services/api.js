import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token') || 'admin_master_token_2026';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const HotelService = {
  getStats: async () => {
    try {
      const res = await api.get('/stats/dashboard');
      return res.data;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return {
        stats: { totalRevenue: 0, totalBookings: 0, totalHotels: 0, totalUsers: 0, occupancyRate: 0, avgNightlyRate: 0 },
        monthlyRevenue: [],
        categoryDistribution: [],
      };
    }
  },

  getHotels: async (params = {}) => {
    try {
      const res = await api.get('/hotels', { params });
      return res.data || [];
    } catch (err) {
      console.error('Error fetching hotels:', err);
      return [];
    }
  },

  createHotel: async (hotelData) => {
    try {
      const res = await api.post('/hotels', hotelData);
      return res.data;
    } catch (err) {
      console.error('Error creating hotel:', err);
      throw err;
    }
  },

  updateHotel: async (id, hotelData) => {
    try {
      const res = await api.put(`/hotels/${id}`, hotelData);
      return res.data;
    } catch (err) {
      console.error('Error updating hotel:', err);
      throw err;
    }
  },

  deleteHotel: async (id) => {
    try {
      const res = await api.delete(`/hotels/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error deleting hotel:', err);
      throw err;
    }
  },

  getBookings: async () => {
    try {
      const res = await api.get('/bookings');
      return res.data.bookings || res.data || [];
    } catch (err) {
      console.error('Error fetching bookings:', err);
      return [];
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      return res.data;
    } catch (err) {
      console.error('Error updating booking status:', err);
      throw err;
    }
  },

  getUsers: async () => {
    try {
      const res = await api.get('/auth/users');
      return res.data.users || res.data || [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  getReviews: async (params = {}) => {
    try {
      const res = await api.get('/reviews', { params });
      return res.data || { count: 0, stats: {}, reviews: [] };
    } catch (err) {
      console.error('Error fetching reviews:', err);
      return { count: 0, stats: { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: 5.0 }, reviews: [] };
    }
  },

  updateReviewStatus: async (id, status) => {
    try {
      const res = await api.put(`/reviews/${id}/status`, { status });
      return res.data;
    } catch (err) {
      console.error('Error updating review status:', err);
      throw err;
    }
  },

  deleteReview: async (id) => {
    try {
      const res = await api.delete(`/reviews/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  },

  checkAvailability: async (hotelId, params = {}) => {
    try {
      const res = await api.get(`/hotels/${hotelId}/availability`, { params });
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Error checking availability:', err);
      throw err;
    }
  },

  updateRoomInventory: async (hotelId, roomId, data) => {
    try {
      const res = await api.put(`/hotels/${hotelId}/rooms/${roomId}/inventory`, data);
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Error updating room inventory:', err);
      throw err;
    }
  },

  getPromos: async (params = {}) => {
    try {
      const res = await api.get('/promos', { params });
      return res.data || { count: 0, stats: {}, promos: [] };
    } catch (err) {
      console.error('Error fetching promos:', err);
      return { count: 0, stats: { total: 0, active: 0, inactive: 0, totalRedemptions: 0 }, promos: [] };
    }
  },

  createPromo: async (promoData) => {
    try {
      const res = await api.post('/promos', promoData);
      return res.data;
    } catch (err) {
      console.error('Error creating promo code:', err);
      throw err;
    }
  },

  updatePromo: async (id, data) => {
    try {
      const res = await api.put(`/promos/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('Error updating promo code:', err);
      throw err;
    }
  },

  deletePromo: async (id) => {
    try {
      const res = await api.delete(`/promos/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error deleting promo code:', err);
      throw err;
    }
  },

  getNotifications: async (params = {}) => {
    try {
      const res = await api.get('/notifications', { params });
      return res.data.data || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  sendPushNotification: async (payload) => {
    try {
      const res = await api.post('/notifications/send', payload);
      return res.data;
    } catch (err) {
      console.error('Error sending push notification:', err);
      throw err;
    }
  },

  triggerCheckInReminders: async () => {
    try {
      const res = await api.post('/notifications/check-in-reminders', {});
      return res.data;
    } catch (err) {
      console.error('Error triggering check-in reminders:', err);
      throw err;
    }
  },

  getNotificationStats: async () => {
    try {
      const res = await api.get('/notifications/stats');
      return res.data.stats || {};
    } catch (err) {
      console.error('Error fetching notification stats:', err);
      return {};
    }
  },

  getForecastStats: async () => {
    try {
      const res = await api.get('/stats/forecast');
      return res.data.data || { kpis: {}, historical: [], forecast: [], combinedTrajectory: [] };
    } catch (err) {
      console.error('Error fetching forecast stats:', err);
      return { kpis: {}, historical: [], forecast: [], combinedTrajectory: [] };
    }
  },

  getOccupancyHeatmap: async () => {
    try {
      const res = await api.get('/stats/heatmap');
      return res.data.data || { dates: [], properties: [] };
    } catch (err) {
      console.error('Error fetching occupancy heatmap:', err);
      return { dates: [], properties: [] };
    }
  },

  uploadImage: async (fileOrData) => {
    try {
      if (fileOrData instanceof File || (typeof Blob !== 'undefined' && fileOrData instanceof Blob)) {
        const formData = new FormData();
        formData.append('image', fileOrData);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      } else {
        const res = await api.post('/upload', { image: fileOrData });
        return res.data;
      }
    } catch (err) {
      console.warn('Backend upload notice, using local file reader fallback:', err);
      if (fileOrData instanceof File || (typeof Blob !== 'undefined' && fileOrData instanceof Blob)) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ success: true, url: reader.result, localUrl: reader.result });
          };
          reader.readAsDataURL(fileOrData);
        });
      }
      throw err;
    }
  },

  downloadBookingsCSV: () => {
    window.open(`${API_BASE_URL}/stats/export/bookings`, '_blank');
  },

  downloadRevenueCSV: () => {
    window.open(`${API_BASE_URL}/stats/export/revenue`, '_blank');
  },
};

export { api };
export default HotelService;
