'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HospitalDetailsPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`/api/hospital/${id}`);
        setHospital(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!hospital) return <p className="text-center text-red-500 p-6">Hospital not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-3 p-4">
          <h1 className="text-2xl font-bold">{hospital.name}</h1>
          <p className="text-gray-600">{hospital.location}</p>
          <p className="text-sm text-gray-500">📍 Lat: {hospital.lat} | Lng: {hospital.lng}</p>

          <div>
            <h2 className="font-semibold">Departments:</h2>
            <p>{hospital.departments?.join(', ') || 'N/A'}</p>
          </div>

          <div>
            <h2 className="font-semibold">Facilities:</h2>
            <p>{hospital.facilities?.join(', ') || 'N/A'}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <Link href={`/hospital/${hospital.id}/book`}>
              <Button className="bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
            </Link>
            <Link href={`/hospital/${hospital.id}/blood`}>
              <Button variant="destructive">Blood / Volunteer</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-2">Doctors Available</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {hospital.doctors?.length > 0 ? (
            hospital.doctors.map((doc: any) => (
              <Card key={doc.id}>
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                  <p className="text-gray-600">{doc.specialization}</p>
                  <p className="text-sm text-gray-500">Email: {doc.email}</p>
                  <p className="text-sm text-gray-500">
                    Slots: {doc.availableSlots?.join(', ') || 'Not specified'}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No doctors listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
