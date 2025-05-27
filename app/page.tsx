import DiseaseCard from "@/components/DiseaseCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HeroSection2 from "@/components/HeroSection2";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-around bg-[#F8F9FA] dark:bg-[#1A1A2E]">
      <HeroSection />
      <DiseaseCard />
      <HeroSection2 />
    </main>
  );
}
