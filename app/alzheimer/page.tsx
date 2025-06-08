"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "",
    age: "",
    file: null as File | null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "file" ? files?.[0] ?? null : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value as string | Blob);
      }
    });

    const res = await fetch("https://b318-34-86-75-124.ngrok-free.app/predict", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const result = await res.json();
      alert(`Prediction: ${result.predicted_class}\nConfidence: ${result.confidence.toFixed(2)}`);
    } else {
      alert("Prediction failed.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-extrabold">Alzheimer Detection</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 mt-24"
        encType="multipart/form-data"
      >
        {/* form fields unchanged */}
      </form>
    </>
  );
};

export default Page;
