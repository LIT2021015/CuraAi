"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
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
  const router = useRouter();

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
    const prediction = Math.random() > 0.5 ? 1 : 0;
    setResult(prediction);
  };

  if (result !== null) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
        <BackgroundGradient className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="w-full max-w-3xl bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-xl text-center">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Diabetes Test Results
            </h1>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-around gap-6">
              <Image
                src="/static/db1.png"
                alt="Result Image"
                width={250}
                height={250}
              />
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
        </BackgroundGradient>
      </div>
    );
  }

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
              >
                Submit
              </button>
            </div>
          </form>
        </BackgroundGradient>
      </div>
    </div>
  );
};

export default Page;
