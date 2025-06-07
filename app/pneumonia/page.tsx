"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card, CardContent } from "@/components/ui/card";

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

  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    setLoading(true);
    setPredictionResult(null);

    try {
      const res = await fetch("https://pneumonia-s3u2.onrender.com/predict", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setPredictionResult(result.prediction || result.error);
    } catch (error) {
      setPredictionResult("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbff] to-[#e6e1f4] dark:from-[#1a1a2e] dark:to-[#2f2f45] p-4">
      <BackgroundGradient className="rounded-[22px] w-full">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-[#1e1e2f] backdrop-blur-xl shadow-xl p-8 sm:p-10 rounded-[20px] border-2 border-[#9F7AEA]">
          <h1 className="text-center text-4xl font-bold text-[#6A4C93] dark:text-[#9F7AEA] mb-8 tracking-tight">
            Pneumonia Detection
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" name="firstname" required onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" name="lastname" required onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="1234567890"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@domain.com"
                required
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="e.g. 25"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="file">Upload Chest Scan</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg font-semibold tracking-wide bg-[#6A4C93] hover:bg-[#5e3c86] dark:bg-[#9F7AEA] dark:hover:bg-[#8561c3]"
            >
              {loading ? "Analyzing..." : "Submit"}
            </Button>
          </form>

          {predictionResult && (
            <Card className="mt-8 shadow-lg border-2 border-[#9F7AEA] bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
              <CardContent className="text-center py-6">
                <h2 className="text-2xl font-bold mb-2 text-purple-800 dark:text-purple-100">
                  Result
                </h2>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {predictionResult}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default Page;
