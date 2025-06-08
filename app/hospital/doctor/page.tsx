'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

type Doctor = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  availableSlots: string[];
};

export default function ManageDoctorsPage() {
  const { data: session, status } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    specialization: '',
    availableSlots: '',
  });

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/hospital/doctor');
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDoctors();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/hospital/doctor', {
        ...form,
        availableSlots: form.availableSlots.split(',').map((slot) => slot.trim()),
      });

      setForm({ name: '', email: '', specialization: '', availableSlots: '' });
      fetchDoctors();
    } catch (err) {
      console.error('Error adding doctor:', err);
      alert('Error adding doctor');
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'hospital') {
    return <p className="text-center text-red-500">Access Denied</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Manage Doctors</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          className="w-full p-2 border rounded"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Available Slots (e.g., 10:00,12:00)"
          className="w-full p-2 border rounded"
          value={form.availableSlots}
          onChange={(e) => setForm({ ...form, availableSlots: e.target.value })}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Doctor
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold">Doctor List</h2>
        <ul className="space-y-2">
          {doctors.map((doc) => (
            <li key={doc.id} className="border p-4 rounded">
              <p><strong>{doc.name}</strong> - {doc.specialization}</p>
              <p>Email: {doc.email}</p>
              <p>Slots: {doc.availableSlots.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
