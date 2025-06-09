"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Appointment {
  id: string;
  dateTime: string;
  videoLink?: string;
  notes?: string;
  user: { name: string; email: string };
  doctor?: { name: string; specialization: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await fetch("/api/hospital/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Manage Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <Card key={appt.id} className="p-4">
              <p><strong>Patient:</strong> {appt.user.name} ({appt.user.email})</p>
              <p><strong>Doctor:</strong> {appt.doctor?.name || "N/A"} ({appt.doctor?.specialization || "N/A"})</p>
              <p><strong>Date & Time:</strong> {new Date(appt.dateTime).toLocaleString()}</p>
              {appt.videoLink && <p><strong>Video Link:</strong> <a href={appt.videoLink} target="_blank" className="text-blue-600">{appt.videoLink}</a></p>}
              {appt.notes && <p><strong>Notes:</strong> {appt.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
