import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, slots, fetchDoctors, fetchSlots, loading, error, clearError } = useApp();
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    fetchDoctors();
    fetchSlots({ date: selectedDate });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots({ date: selectedDate, specialization: selectedSpecialization || undefined });
    }
  }, [selectedDate, selectedSpecialization]);

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

  const groupedSlots = slots.reduce((acc, slot) => {
    const key = slot.doctor_name || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {} as Record<string, typeof slots>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Doctor Appointment
          </h1>
          <p className="text-xl text-primary-100">
            Find available slots and book appointments with top healthcare professionals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Find Available Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>

        {/* Available Slots */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : slots.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Available Slots
              </h3>
              <p className="text-gray-500">
                Try selecting a different date or specialization
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSlots).map(([doctorName, doctorSlots]) => (
              <Card key={doctorName}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {doctorName}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Stethoscope className="w-4 h-4" />
                      {doctorSlots[0].specialization}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Available Slots</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {doctorSlots.length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {doctorSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => navigate(`/booking/${slot.id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors border border-primary-200"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{slot.slot_time.slice(0, 5)}</span>
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;