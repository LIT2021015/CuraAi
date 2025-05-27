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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    fetch("/api/pneumonia/result", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => alert(JSON.stringify(data)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbff] to-[#e6e1f4] dark:from-[#1a1a2e] dark:to-[#2f2f45] p-4">
      <BackgroundGradient className="rounded-[22px]">
        <div className="max-w-3xl w-full mx-auto bg-white dark:bg-[#1e1e2f] backdrop-blur-xl shadow-xl p-8 sm:p-10 rounded-[20px] border-2 border-[#9F7AEA]">
          <h1 className="text-center text-4xl font-bold text-[#6A4C93] dark:text-[#9F7AEA] mb-8 tracking-tight">
            Pneumonia Detection
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstname" className="text-base font-medium">
                  First Name
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  placeholder="John"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="lastname" className="text-base font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Doe"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="1234567890"
                required
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Include your area code</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
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
                <Label htmlFor="gender" className="text-base font-medium">
                  Gender
                </Label>
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
                <Label htmlFor="age" className="text-base font-medium">
                  Age
                </Label>
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
              <Label htmlFor="file" className="text-base font-medium">
                Upload Chest Scan
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a clear X-ray or chest scan image
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-6 text-lg font-semibold tracking-wide bg-[#6A4C93] hover:bg-[#5e3c86] dark:bg-[#9F7AEA] dark:hover:bg-[#8561c3]"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default Page;
