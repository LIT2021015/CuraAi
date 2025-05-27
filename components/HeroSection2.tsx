"use client";
import Image from "next/image";
import React from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const HeroSection2 = () => {
  return (
    <section className="flex flex-col items-center justify-center mt-10 px-4 sm:px-6 lg:px-12">
      <BackgroundGradient
        className="w-full max-w-6xl rounded-[28px] px-8 py-12 text-gray-900 dark:text-slate-100 bg-white dark:bg-zinc-900"
        containerClassName="w-full"
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="text-4xl sm:text-5xl font-bold italic text-[#2f855a] dark:text-[#48CFAD] bg-clip-text mb-6">
            AI in Healthcare
          </h3>

          <p className="text-lg sm:text-xl max-w-4xl leading-relaxed text-gray-700 dark:text-slate-300 mb-8">
            The integration of AI in healthcare is transforming how we approach
            diagnosis and patient care. From medical imaging to predictive
            analytics, AI empowers doctors with faster, more accurate insights.
          </p>

          <div className="mt-6">
            <Image
              src="/images/healthcure.png"
              alt="Healthcare AI"
              height={600}
              width={800}
              className="rounded-2xl border-4 border-cyan-500 dark:border-cyan-400 shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </BackgroundGradient>
    </section>
  );
};

export default HeroSection2;
