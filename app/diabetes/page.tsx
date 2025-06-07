"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "male",
    pregnancies: "",
    glucose: "",
    bloodpressure: "",
    skin: "",
    insulin: "",
    bmi: "",
    diabetespedigree: "",
    age: "",
  });

  const [result, setResult] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://diabetes-u5u0.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      // const data = await response.json();
console.log("Raw prediction response:", data);
console.log("Parsed prediction value:", Number(data.result));
// setResult(Number(data.result));

      setResult(Number(data.result));
      console.log("Prediction:", data.result, typeof data.result);

    } catch (err: any) {
      console.error(err);
      setError("Something went wrong while fetching the prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <div className="py-20 w-full max-w-4xl">
        <BackgroundGradient className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-[#333333] dark:text-[#E6E6E6]">
              Diabetes Detection
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Firstname</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Lastname</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Phone No.</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <small className="">* Include your area code</small>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "pregnancies", placeholder: "Pregnancies" },
                { name: "glucose", placeholder: "Glucose" },
                { name: "bloodpressure", placeholder: "Blood Pressure" },
                { name: "skin", placeholder: "Skin Thickness" },
                { name: "insulin", placeholder: "Insulin" },
                { name: "bmi", placeholder: "BMI", step: "any" },
                {
                  name: "diabetespedigree",
                  placeholder: "Diabetes Pedigree",
                  step: "any",
                },
                { name: "age", placeholder: "Age" },
              ].map(({ name, placeholder, step }) => (
                <input
                  key={name}
                  type="number"
                  step={step}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  required
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-1/2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Submit"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-red-600 text-center font-semibold">{error}</p>
          )}

          {result !== null && (
            <div className="mt-10 border-t pt-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Result
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                {/* <Image
                  src="/static/db1.png"
                  alt="Result Image"
                  width={250}
                  height={250}
                /> */}
                <div className="space-y-2 text-left text-gray-700 dark:text-gray-200">
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
                  <p className="mt-4 text-xl font-semibold">
                    Result:{" "}
                    <span
                      className={result === 1 ? "text-red-600" : "text-green-600"}
                    >
                      {result === 1 ? "POSITIVE" : "NEGATIVE"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default Page;
