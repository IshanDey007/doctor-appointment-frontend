import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, CheckCircle } from 'lucide-react';
import { slotApi } from '../services/api';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { AppointmentSlot } from '../types';

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createBooking, loading, error, clearError } = useApp();
  
  const [slot, setSlot] = useState<AppointmentSlot | null>(null);
  const [loadingSlot, setLoadingSlot] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_phone: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const data = await slotApi.getById(parseInt(id!));
        setSlot(data);
      } catch (err) {
        console.error('Failed to fetch slot:', err);
      } finally {
        setLoadingSlot(false);
      }
    };

    if (id) {
      fetchSlot();
    }
  }, [id]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.patient_name.trim()) {
      errors.patient_name = 'Name is required';
    }

    if (!formData.patient_email.trim()) {
      errors.patient_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patient_email)) {
      errors.patient_email = 'Invalid email format';
    }

    if (formData.patient_phone && !/^\+?[\d\s-()]+$/.test(formData.patient_phone)) {
      errors.patient_phone = 'Invalid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createBooking({
        slot_id: parseInt(id!),
        ...formData,
      });
      setBookingSuccess(true);
    } catch (err) {
      // Error handled by context
    }
  };

  if (loadingSlot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Slot Not Found</h2>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Doctor:</strong> {slot.doctor_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Specialization:</strong> {slot.specialization}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Date:</strong> {slot.slot_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Time:</strong> {slot.slot_time.slice(0, 5)}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate('/')} fullWidth>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4 text-white border-white hover:bg-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Book Appointment</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* Slot Details */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-semibold">{slot.doctor_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-semibold">{slot.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{slot.slot_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">{slot.slot_time.slice(0, 5)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Patient Information Form */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Patient Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              error={formErrors.patient_name}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              required
              value={formData.patient_email}
              onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
              error={formErrors.patient_email}
              fullWidth
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.patient_phone}
              onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
              error={formErrors.patient_phone}
              fullWidth
            />
            <Button type="submit" loading={loading} fullWidth size="lg">
              Confirm Booking
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Booking;