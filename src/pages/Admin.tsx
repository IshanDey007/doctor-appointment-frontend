import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, fetchDoctors, createDoctor, createBulkSlots, loading, error, clearError } = useApp();
  
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
  });
  const [slotForm, setSlotForm] = useState({
    doctor_id: '',
    slot_date: '',
    start_time: '09:00',
    end_time: '17:00',
    duration_minutes: '30',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDoctor(doctorForm);
      setSuccess('Doctor created successfully!');
      setDoctorForm({ name: '', specialization: '', email: '', phone: '' });
      setShowDoctorForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleCreateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...slotForm,
        doctor_id: parseInt(slotForm.doctor_id),
        duration_minutes: parseInt(slotForm.duration_minutes),
      };
      await createBulkSlots(data);
      setSuccess('Slots created successfully!');
      setSlotForm({
        doctor_id: '',
        slot_date: '',
        start_time: '09:00',
        end_time: '17:00',
        duration_minutes: '30',
      });
      setShowSlotForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by context
    }
  };

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
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-primary-100 mt-2">Manage doctors and appointment slots</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={clearError} />
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctors Section */}
          <div>
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Doctors</h2>
                <Button onClick={() => setShowDoctorForm(!showDoctorForm)}>
                  <Plus className="w-4 h-4" />
                  Add Doctor
                </Button>
              </div>

              {showDoctorForm && (
                <form onSubmit={handleCreateDoctor} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Create New Doctor</h3>
                  <div className="space-y-4">
                    <Input
                      label="Name"
                      required
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      fullWidth
                    />
                    <Input
                      label="Specialization"
                      required
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                      fullWidth
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                      fullWidth
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                      fullWidth
                    />
                    <div className="flex gap-2">
                      <Button type="submit" loading={loading}>Create</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDoctorForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {loading && !showDoctorForm ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-3">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                      <p className="text-gray-500 text-sm">{doctor.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Slots Section */}
          <div>
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create Slots</h2>
                <Button onClick={() => setShowSlotForm(!showSlotForm)}>
                  <Plus className="w-4 h-4" />
                  Add Slots
                </Button>
              </div>

              {showSlotForm && (
                <form onSubmit={handleCreateSlots} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Create Appointment Slots</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={slotForm.doctor_id}
                        onChange={(e) => setSlotForm({ ...slotForm, doctor_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Date"
                      type="date"
                      required
                      value={slotForm.slot_date}
                      onChange={(e) => setSlotForm({ ...slotForm, slot_date: e.target.value })}
                      fullWidth
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Start Time"
                        type="time"
                        required
                        value={slotForm.start_time}
                        onChange={(e) => setSlotForm({ ...slotForm, start_time: e.target.value })}
                        fullWidth
                      />
                      <Input
                        label="End Time"
                        type="time"
                        required
                        value={slotForm.end_time}
                        onChange={(e) => setSlotForm({ ...slotForm, end_time: e.target.value })}
                        fullWidth
                      />
                    </div>
                    <Input
                      label="Duration (minutes)"
                      type="number"
                      required
                      min="15"
                      max="120"
                      value={slotForm.duration_minutes}
                      onChange={(e) => setSlotForm({ ...slotForm, duration_minutes: e.target.value })}
                      fullWidth
                    />
                    <div className="flex gap-2">
                      <Button type="submit" loading={loading}>Create Slots</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowSlotForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {!showSlotForm && (
                <div className="text-center py-8 text-gray-500">
                  <p>Click "Add Slots" to create appointment slots for doctors</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;