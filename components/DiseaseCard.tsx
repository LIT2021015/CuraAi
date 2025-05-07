import Image from "next/image";
import React from "react";

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
    name: "Alzheimer Detection",
    link: "/alzheimer",
    image: "/images/icons/alzheimer.png",
  },
  {
    name: "Diabetes Detection",
    link: "/diabetes",
    image: "/images/icons/diabetes.png",
  },
];

const DiseaseCard: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="text-center text-white bg-black py-3 text-2xl font-semibold uppercase">
        Disease Detections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-28 mt-8 justify-center">
        
        {diseases.map((disease) => (
          <div key={disease.name} className="text-center">
            <h3 className="py-3 text-lg font-bold bg-slate-800 rounded-2xl text-slate-100">{disease.name}</h3>
            <a href={disease.link}>
              <Image
                src={disease.image}
                alt={disease.name}
                className="rounded-lg shadow-lg"
                height={400}
                width={400}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseCard;
