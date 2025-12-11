import axios, { AxiosError } from 'axios';
import type {
  Doctor,
  AppointmentSlot,
  Booking,
  BookingStats,
  ApiResponse,
  CreateDoctorData,
  CreateSlotData,
  CreateBulkSlotsData,
  CreateBookingData,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<never>>;
    throw new Error(
      axiosError.response?.data?.error || 
      axiosError.message || 
      'An error occurred'
    );
  }
  throw error;
};

// Doctor APIs
export const doctorApi = {
  getAll: async (specialization?: string): Promise<Doctor[]> => {
    try {
      const params = specialization ? { specialization } : {};
      const response = await api.get<ApiResponse<Doctor[]>>('/doctors', { params });
      return response.data.data || [];
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id: number): Promise<Doctor> => {
    try {
      const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (data: CreateDoctorData): Promise<Doctor> => {
    try {
      const response = await api.post<ApiResponse<Doctor>>('/doctors', data);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id: number, data: Partial<CreateDoctorData>): Promise<Doctor> => {
    try {
      const response = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/doctors/${id}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Slot APIs
export const slotApi = {
  getAvailable: async (filters?: {
    doctor_id?: number;
    date?: string;
    specialization?: string;
  }): Promise<AppointmentSlot[]> => {
    try {
      const response = await api.get<ApiResponse<AppointmentSlot[]>>('/slots', {
        params: filters,
      });
      return response.data.data || [];
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id: number): Promise<AppointmentSlot> => {
    try {
      const response = await api.get<ApiResponse<AppointmentSlot>>(`/slots/${id}`);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (data: CreateSlotData): Promise<AppointmentSlot> => {
    try {
      const response = await api.post<ApiResponse<AppointmentSlot>>('/slots', data);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  createBulk: async (data: CreateBulkSlotsData): Promise<AppointmentSlot[]> => {
    try {
      const response = await api.post<ApiResponse<AppointmentSlot[]>>('/slots/bulk', data);
      return response.data.data || [];
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/slots/${id}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Booking APIs
export const bookingApi = {
  getAll: async (filters?: {
    status?: string;
    patient_email?: string;
  }): Promise<Booking[]> => {
    try {
      const response = await api.get<ApiResponse<Booking[]>>('/bookings', {
        params: filters,
      });
      return response.data.data || [];
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id: number): Promise<Booking> => {
    try {
      const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    try {
      const response = await api.post<ApiResponse<Booking>>('/bookings', data);
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },

  cancel: async (id: number): Promise<void> => {
    try {
      await api.put(`/bookings/${id}/cancel`);
    } catch (error) {
      return handleError(error);
    }
  },

  getStats: async (): Promise<BookingStats> => {
    try {
      const response = await api.get<ApiResponse<BookingStats>>('/bookings/stats');
      return response.data.data!;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api;