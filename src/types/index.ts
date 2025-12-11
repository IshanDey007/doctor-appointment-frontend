export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentSlot {
  id: number;
  doctor_id: number;
  slot_date: string;
  slot_time: string;
  duration_minutes: number;
  is_available: boolean;
  doctor_name?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';

export interface Booking {
  id: number;
  slot_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  status: BookingStatus;
  booking_time: string;
  confirmed_at?: string;
  failed_at?: string;
  failure_reason?: string;
  slot_date?: string;
  slot_time?: string;
  duration_minutes?: number;
  doctor_name?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingStats {
  confirmed: number;
  pending: number;
  failed: number;
  cancelled: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

export interface CreateDoctorData {
  name: string;
  specialization: string;
  email: string;
  phone?: string;
}

export interface CreateSlotData {
  doctor_id: number;
  slot_date: string;
  slot_time: string;
  duration_minutes?: number;
}

export interface CreateBulkSlotsData {
  doctor_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
}

export interface CreateBookingData {
  slot_id: number;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
}