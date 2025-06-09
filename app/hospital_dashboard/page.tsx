"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BloodStock {
  bloodGroup: string;
  quantity: number;
}
interface HospitalData {
  name: string;
  email: string;
  location: string;
  departments: string[];
  facilities: string[];
  bloodTypes: BloodStock[];
}

export default function HospitalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hospital, setHospital] = useState<HospitalData | null>(null);

  useEffect(() => {
    const fetchHospital = async () => {
      const res = await fetch("/api/hospital/me");
      if (res.ok) {
        const data = await res.json();
        setHospital(data.hospital);
        console.log(data);
      } else {
        alert("Failed to fetch hospital details.");
      }
    };

    if (status === "authenticated") {
      fetchHospital();
    }
      if (status === "unauthenticated") {
    router.push("/hospital_registration");
  }
  }, [status]);



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 mt-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">🏥 Hospital Dashboard</h1>
        <Button variant="destructive" onClick={() => signOut()}>
          Logout
        </Button>
      </div>

      {/* Hospital Info */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Hospital Information</h2>
        {hospital ? (
          <div className="space-y-2 text-gray-800">
            <p><strong>Name:</strong> {hospital.name}</p>
            <p><strong>Email:</strong> {hospital.email}</p>
            <p><strong>Location:</strong> {hospital.location}</p>
            <p><strong>Departments:</strong> {hospital.departments.join(", ")}</p>
            <p><strong>Facilities:</strong> {hospital.facilities.join(", ")}</p>
            <p><strong>Available Blood Types:</strong> {hospital.bloodTypes?.map(bt => bt.bloodGroup).join(", ")}</p>

          </div>
        ) : (
          <p>Loading hospital data...</p>
        )}
        {/* <div className="mt-4">
          <Button onClick={() => router.push("/hospital/edit-profile")}>
            Edit Profile
          </Button>
        </div> */}
      </Card>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">📅 Manage Appointments</h3>
          <Button onClick={() => router.push("/hospital/appointments")}>
            Go to Appointments
          </Button>
        </Card>

        {/* <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">🩸 Handle Blood Requests</h3>
          <Button onClick={() => router.push("/hospital/blood-requests")}>
            Go to Blood Requests
          </Button>
        </Card> */}

        <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">💉 Blood Stock Management</h3>
          <Button onClick={() => router.push("/hospital/blood-stock")}>
            Manage Blood Stock
          </Button>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">👨‍⚕️ Doctor Management</h3>
          <Button onClick={() => router.push("/hospital/doctor")}>
            Manage Doctors
          </Button>
        </Card>

        {/* <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">💻 Online Consultations</h3>
          <Button onClick={() => router.push("/hospital/consultations")}>
            Consultation Logs
          </Button>
        </Card> */}

        <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">🧑‍🤝‍🧑 Volunteers</h3>
          <Button onClick={() => router.push("/hospital/volunteers")}>
            View Volunteers
          </Button>
        </Card>

        {/* <Card className="p-5">
          <h3 className="font-medium text-lg mb-3">🚨 Emergency SOS Alerts</h3>
          <Button onClick={() => router.push("/hospital/emergency-alerts")}>
            View Alerts
          </Button>
        </Card> */}
      </div>
    </div>
  );
}
