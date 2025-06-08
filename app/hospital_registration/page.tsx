"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function HospitalRegisterPage() {
  const router = useRouter();
  const mapElement = useRef<HTMLDivElement>(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    lat: 0,
    lng: 0,
    departments: "",
    facilities: "",
    bloodTypes: "",
  });

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...formData,
      departments: formData.departments.split(",").map((d) => d.trim()),
      facilities: formData.facilities.split(",").map((f) => f.trim()),
      bloodTypes: formData.bloodTypes.split(",").map((b) => b.trim()),
    };

    if (isRegistering) {
      const res = await fetch("/api/hospital/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Registration successful!");
        setIsRegistering(false);
      } else {
        alert("Registration failed!");
      }
    } else {
      const res = await signIn("hospital-credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/hospital_dashboard");
      } else {
        alert("Login failed!");
      }
    }
  };

  // Initialize TomTom Map
  useEffect(() => {
    if (!isRegistering || !mapElement.current) return;

    const tt = require("@tomtom-international/web-sdk-maps");
    const ttServices = require("@tomtom-international/web-sdk-services");
    const apiKey = "HyRPaJMF8U1ze1aGjGbwmrVhgFJH8sbT";

    const map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [80.9462, 26.8467], // default to Lucknow
      zoom: 12,
    });

    const marker = new tt.Marker({ anchor: "bottom" }) // Fixed anchor
      .setLngLat([80.9462, 26.8467])
      .addTo(map);

    map.on("click", (e: any) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      marker.setLngLat([lng, lat]);

      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
        location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      }));
    });

    return () => map.remove();
  }, [isRegistering]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 mt-5">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isRegistering ? "Hospital Registration" : "Hospital Login"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegistering ? (
            <>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Hospital Name" required onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="location">Select Location on Map</Label>
                <div
                  ref={mapElement}
                  className="w-full rounded border mt-2"
                  style={{ height: "240px" }}
                />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  readOnly
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="departments">Departments (comma-separated)</Label>
                <Input id="departments" name="departments" placeholder="Cardiology, Neurology" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                <Input id="facilities" name="facilities" placeholder="ICU, MRI, X-ray" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="bloodTypes">Blood Types Available</Label>
                <Input id="bloodTypes" name="bloodTypes" placeholder="A+, B-, O+" onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </>
          )}
        </form>

        <p className="text-sm text-center mt-4">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-600 hover:underline"
          >
            {isRegistering ? "Login here" : "Register here"}
          </button>
        </p>
      </Card>
    </div>
  );
}
