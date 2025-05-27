"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const diseases = [
  { name: "Brain Tumor", link: "/braintumor" },
  { name: "Pneumonia", link: "/pneumonia" },
  { name: "Covid", link: "/covid" },
  { name: "Breast Cancer", link: "/breastcancer" },
  { name: "Alzheimer", link: "/alzheimer" },
  { name: "Diabetes", link: "/diabetes" },
];

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDiseaseOpen, setDiseaseOpen] = useState(false);
  const diseaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        diseaseRef.current &&
        !diseaseRef.current.contains(event.target as Node)
      ) {
        setDiseaseOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#2A5C99] dark:bg-[#4A89DC] flex justify-between items-center px-4 md:px-10 py-2 z-50 shadow-lg h-16">
      {/* Logo Text */}
      <div className="text-3xl font-extrabold italic text-white animate-pulse">
        Cura<span className="text-yellow-300">AI</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 text-white font-medium">
        <div className="relative" ref={diseaseRef}>
          <button
            onClick={() => setDiseaseOpen(!isDiseaseOpen)}
            className="hover:text-yellow-300 transition"
          >
            Diseases
          </button>
          {isDiseaseOpen && (
            <div className="absolute top-10 left-0 bg-[#2A5C99] dark:bg-[#4A89DC] rounded shadow-lg p-2 space-y-2 z-50">
              {diseases.map((disease) => (
                <Link
                  key={disease.name}
                  href={disease.link}
                  className="block px-4 py-2 hover:bg-[#1e4477] rounded"
                >
                  {disease.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#2A5C99] dark:bg-[#4A89DC] flex flex-col items-center py-4 text-white space-y-3 font-medium shadow-md z-40">
          <button
            onClick={() => setDiseaseOpen(!isDiseaseOpen)}
            className="text-lg hover:text-yellow-300"
          >
            Diseases
          </button>
          {isDiseaseOpen &&
            diseases.map((disease) => (
              <Link
                key={disease.name}
                href={disease.link}
                className="text-lg hover:text-yellow-300"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDiseaseOpen(false);
                }}
              >
                {disease.name}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
