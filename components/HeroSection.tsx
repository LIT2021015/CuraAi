import React from "react";

const HeroSection = () => {
  return (
    <div className="mt-32 flex flex-col items-center justify-center ml-5 text-[#333333] dark:text-[#E6E6E6]">
      <h1 className="text-4xl font-bold">
        SmartDiagnose - a Unified Health-Tech Platform
      </h1>
      <br />
      <h1 className="text-xl text-center max-w-4xl">
        <b>SmartDiagnose</b> brings 6 disease detections like Covid, Brain
        Tumor, Breast Cancer, Diabetes, Pneumonia, and Heart Disease
        under one platform.
      </h1>
    </div>
  );
};

export default HeroSection;
