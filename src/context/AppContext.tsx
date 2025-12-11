import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Doctor, AppointmentSlot, Booking } from '../types';
import { doctorApi, slotApi, bookingApi } from '../services/api';

interface AppContextType {
  // State
  doctors: Doctor[];
  slots: AppointmentSlot[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  
  // Doctor actions
  fetchDoctors: (specialization?: string) => Promise<void>;
  createDoctor: (data: any) => Promise<Doctor>;
  
  // Slot actions
  fetchSlots: (filters?: any) => Promise<void>;
  createSlot: (data: any) => Promise<AppointmentSlot>;
  createBulkSlots: (data: any) => Promise<AppointmentSlot[]>;
  
  // Booking actions
  fetchBookings: (filters?: any) => Promise<void>;
  createBooking: (data: any) => Promise<Booking>;
  cancelBooking: (id: number) => Promise<void>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Doctor actions
  const fetchDoctors = useCallback(async (specialization?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorApi.getAll(specialization);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDoctor = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const doctor = await doctorApi.create(data);
      setDoctors(prev => [...prev, doctor]);
      return doctor;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Slot actions
  const fetchSlots = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await slotApi.getAvailable(filters);
      setSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSlot = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const slot = await slotApi.create(data);
      setSlots(prev => [...prev, slot]);
      return slot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBulkSlots = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const newSlots = await slotApi.createBulk(data);
      setSlots(prev => [...prev, ...newSlots]);
      return newSlots;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slots');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Booking actions
  const fetchBookings = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingApi.getAll(filters);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingApi.create(data);
      setBookings(prev => [...prev, booking]);
      // Remove booked slot from available slots
      setSlots(prev => prev.filter(slot => slot.id !== data.slot_id));
      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookingApi.cancel(id);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === id ? { ...booking, status: 'CANCELLED' } : booking
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AppContextType = {
    doctors,
    slots,
    bookings,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    fetchSlots,
    createSlot,
    createBulkSlots,
    fetchBookings,
    createBooking,
    cancelBooking,
    clearError,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};