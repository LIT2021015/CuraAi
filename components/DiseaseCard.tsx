"use client";
import Image from "next/image";
import React from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface Disease {
  name: string;
  link: string;
  image: string;
}

const diseases: Disease[] = [
  {
    name: "Brain Tumor Detection",
    link: "/braintumor",
    image: "/images/icons/braintumor.png",
  },
  {
    name: "Pneumonia Detection",
    link: "/pneumonia",
    image: "/images/icons/pneumonia.png",
  },
  {
    name: "Covid Detection",
    link: "/covid",
    image: "/images/icons/covid.jpg",
  },
  {
    name: "Breast Cancer",
    link: "/breastcancer",
    image: "/images/icons/breastcancer.png",
  },
  {
    name: "Heart Disease",
    link: "/heartdisease",
    image: "/images/icons/heartdisease.png",
  },
  {
    name: "Diabetes Detection",
    link: "/diabetes",
    image: "/images/icons/diabetes.png",
  },
];

const DiseaseCard: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#2f855a] dark:text-[#48CFAD] mb-12 tracking-wide uppercase">
        Disease Detections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-center">
        {diseases.map((disease) => (
          <BackgroundGradient
            key={disease.name}
            className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-[#4A90E2] to-[#7B61FF] text-white px-6 py-2 rounded-full shadow-md">
                {disease.name}
              </h3>
              <a href={disease.link} className="group">
                <Image
                  src={disease.image}
                  alt={disease.name}
                  className="rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                  width={300}
                  height={300}
                />
              </a>
            </div>
          </BackgroundGradient>
        ))}
      </div>
    </section>
  );
};

export default DiseaseCard;
