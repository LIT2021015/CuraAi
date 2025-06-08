'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function BookAppointmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const hospitalId = pathname.split('/')[2]; 
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/user_registration');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`/api/hospital/${hospitalId}/doctors`);
        setDoctors(res.data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };

    if (hospitalId) {
      fetchDoctors();
    }
  }, [hospitalId]);

  const handleSubmit = async () => {
    if (!selectedDoctor || !date || !time) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('/api/user/appointment', {
        hospitalId,
        doctorId: selectedDoctor,
        dateTime: new Date(`${date}T${time}`),
      });

      alert('Appointment booked successfully!');
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Failed to book appointment', error);
      alert('Booking failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl">Book Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Select Doctor</Label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              <option value="">-- Choose a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
