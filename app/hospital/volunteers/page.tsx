"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Volunteer {
  id: string;
  name: string;
  contact: string;
  bloodGroup: string;
  registeredAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const res = await fetch("/api/hospital/volunteers");
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    };

    fetchVolunteers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 Registered Volunteers</h1>

      {volunteers.length === 0 ? (
        <p>No volunteers found.</p>
      ) : (
        <div className="space-y-4">
          {volunteers.map((v) => (
            <Card key={v.id} className="p-4">
              <p><strong>Name:</strong> {v.name} ({v.user?.name})</p>
              <p><strong>Contact:</strong> {v.contact}</p>
              <p><strong>Blood Group:</strong> {v.bloodGroup}</p>
              <p><strong>Registered:</strong> {new Date(v.registeredAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
