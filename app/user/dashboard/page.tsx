'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Appointment = {
  id: string;
  dateTime: string;
  doctor: { name: string; specialization: string };
  hospital: { name: string; location: string };
  status?: string;
};

type BloodRequest = {
  id: string;
  bloodGroup: string;
  units: number;
  createdAt: string;
  status?: string;
  fulfilledBy: { name: string; location: string };
};

type BloodVolunteer = {
  id: string;
  bloodGroup: string;
  registeredAt: string;
  hospital: { name: string; location: string };
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function UserDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [volunteerDonations, setVolunteerDonations] = useState<BloodVolunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/user/dashboard');
        setUser(res.data.user);
        setAppointments(res.data.appointments || []);
        setBloodRequests(res.data.bloodRequests || []);
        setVolunteerDonations(res.data.bloodVolunteers || []);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 space-y-8">
      {/* Profile Section */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Welcome, {user?.name || user?.email}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <p className="text-gray-700"><strong>Email:</strong> {user?.email}</p>
          <Button variant="destructive" onClick={() => signOut()}>Logout</Button>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments booked yet.</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appt) => (
                <li key={appt.id} className="border p-4 rounded shadow-sm bg-gray-50">
                  <p><strong>Date & Time:</strong> {new Date(appt.dateTime).toLocaleString()}</p>
                  <p><strong>Doctor:</strong> Dr. {appt?.doctor?.name} ({appt.doctor.specialization})</p>
                  <p><strong>Hospital:</strong> {appt?.hospital?.name}, {appt.hospital.location}</p>
                  {appt.status && <p><strong>Status:</strong> {appt.status}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Blood Requests */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Your Blood Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {bloodRequests.length === 0 ? (
            <p className="text-gray-500">You havent raised any blood requests yet.</p>
          ) : (
            <ul className="space-y-4">
              {bloodRequests.map((req) => (
                <li key={req.id} className="border p-4 rounded shadow-sm bg-red-50">
                  <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
                  <p><strong>Units:</strong> {req.units}</p>
                  <p><strong>Hospital:</strong> {req.fulfilledBy?.name}, {req.fulfilledBy?.location}</p>
                  <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                  {req.status && <p><strong>Status:</strong> {req.status}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Registrations */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Your Blood Donation Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {volunteerDonations.length === 0 ? (
            <p className="text-gray-500">No volunteer donation records found.</p>
          ) : (
            <ul className="space-y-4">
              {volunteerDonations.map((vol) => (
                <li key={vol.id} className="border p-4 rounded shadow-sm bg-green-50">
                  <p><strong>Blood Group:</strong> {vol.bloodGroup}</p>
                  <p><strong>Hospital:</strong> {vol.hospital.name}, {vol.hospital.location}</p>
                  <p><strong>Registered At:</strong> {new Date(vol.registeredAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
