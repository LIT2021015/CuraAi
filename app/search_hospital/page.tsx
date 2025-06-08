'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Hospital = {
  id: string;
  name: string;
  email: string;
  location: string;
  lat: number;
  lng: number;
};

type HospitalWithDistance = Hospital & {
  distance: number;
  duration: number;
};

export default function HospitalSearchPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(true);

  const getHospitals = async () => {
    const res = await axios.get('/api/hospital/get_hospital');
    return res.data as Hospital[];
  };

  const fetchDistances = async (userLoc: { lat: number; lng: number }, hospitals: Hospital[]) => {
    const promises = hospitals.map(async (hospital) => {
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${userLoc.lat},${userLoc.lng}:${hospital.lat},${hospital.lng}/json?key=HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT`;
      const res = await axios.get(url);
      const summary = res.data.routes[0].summary;
      return {
        ...hospital,
        distance: summary.lengthInMeters / 1000,
        duration: summary.travelTimeInSeconds / 60,
      };
    });

    const hospitalsWithDistance = await Promise.all(promises);
    hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
    setHospitals(hospitalsWithDistance);
    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(userLoc);
        const hospitals = await getHospitals();
        fetchDistances(userLoc, hospitals);
      },
      () => {
        alert('Please allow location access');
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading nearby hospitals...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Nearby Hospitals</h1>
      {hospitals.map((hospital) => (
        <div key={hospital.id} className="border rounded-lg p-4 shadow-md space-y-2">
          <Link href={`/hospital/${hospital.id}`}>
            <h2 className="text-xl font-semibold hover:underline cursor-pointer">{hospital.name}</h2>
          </Link>
          <p className="text-gray-600">{hospital.location}</p>
          <p className="text-sm">Distance: {hospital.distance.toFixed(2)} km</p>
          <p className="text-sm">Estimated Time: {hospital.duration.toFixed(1)} mins</p>
          <div className="flex gap-3 mt-2">
            <a
              href={`/map?startLat=${userLocation?.lat}&startLng=${userLocation?.lng}&endLat=${hospital.lat}&endLng=${hospital.lng}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Get Directions
            </a>
            <Link
              href={`/hospital/${hospital.id}/book`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Book Appointment
            </Link>
            <Link
              href={`/hospital/${hospital.id}/blood`}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Blood / Volunteer
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
