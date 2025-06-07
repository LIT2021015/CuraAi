"use client";

import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "male",
    op: "",
    mhra: "",
    eia: "0",
    nmv: "0",
    tcp: "0",
    age: "",
    thal: "1",
  });

  const [result, setResult] = useState<null | "POSITIVE" | "NEGATIVE">(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://heartdisease-5ivk.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: parseInt(formData.age) || 0,
          sex: formData.gender === "male" ? 1 : 0,
          cp: parseInt(formData.tcp) || 0,
          trestbps: 120,
          chol: 200,
          fbs: 0,
          restecg: 1,
          thalach: parseInt(formData.mhra) || 0,
          exang: parseInt(formData.eia) || 0,
          oldpeak: parseFloat(formData.op) || 0,
          slope: 2,
          ca: parseInt(formData.nmv) || 0,
          thal: parseInt(formData.thal) || 1,
        }),
      });

      const data = await res.json();
      console.log(data)
      setResult(data.prediction === 1 ? "POSITIVE" : "NEGATIVE");
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to get prediction. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <BackgroundGradient className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-zinc-800 shadow-2xl transition-all duration-300">
          <div className="p-6 md:p-10">
            <h1 className="text-4xl font-bold text-center mb-8">
              Heart Disease Detection
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="w-full p-3 rounded-xl border-2"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="w-full p-3 rounded-xl border-2"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full p-3 rounded-xl border-2"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full p-3 rounded-xl border-2"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-xl border-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  step="any"
                  name="op"
                  value={formData.op}
                  onChange={handleChange}
                  required
                  placeholder="Old Peak (ST depression)"
                  className="w-full p-3 rounded-xl border-2"
                />
                <input
                  type="number"
                  step="any"
                  name="mhra"
                  value={formData.mhra}
                  onChange={handleChange}
                  required
                  placeholder="Max Heart Rate"
                  className="w-full p-3 rounded-xl border-2"
                />
                <select
                  name="eia"
                  value={formData.eia}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-xl border-2"
                >
                  <option value="0">No Exercise Induced Angina</option>
                  <option value="1">Exercise Induced Angina</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  name="nmv"
                  value={formData.nmv}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-xl border-2"
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n} Major Vessels (CA = {n})
                    </option>
                  ))}
                </select>
                <select
                  name="tcp"
                  value={formData.tcp}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-xl border-2"
                >
                  <option value="0">Typical Angina (CP = 0)</option>
                  <option value="1">Atypical Angina (CP = 1)</option>
                  <option value="2">Non-Anginal Pain (CP = 2)</option>
                  <option value="3">Asymptomatic (CP = 3)</option>
                </select>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="Age"
                  className="p-3 rounded-xl border-2"
                />
                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-xl border-2"
                >
                  <option value="1">Normal (Thal = 1)</option>
                  <option value="2">Fixed Defect (Thal = 2)</option>
                  <option value="3">Reversible Defect (Thal = 3)</option>
                </select>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 rounded-xl text-white font-medium shadow-md transition-transform transform hover:scale-105"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>

          {result && (
            <div className="mt-8 p-6 rounded-2xl shadow-lg text-center bg-white dark:bg-zinc-900">
              <h2 className="text-2xl font-bold mb-4">Test Results</h2>
              <p>
                <strong>First Name:</strong> {formData.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {formData.lastname}
              </p>
              <p>
                <strong>Age:</strong> {formData.age}
              </p>
              <p>
                <strong>Gender:</strong> {formData.gender}
              </p>
              <p
                className={`mt-4 text-xl font-bold ${
                  result === "POSITIVE" ? "text-red-600" : "text-green-600"
                }`}
              >
                Result: <i>{result}</i>
              </p>
            </div>
          )}
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default Page;
