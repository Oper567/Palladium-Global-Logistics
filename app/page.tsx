import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FleetServices from "@/components/FleetServices";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. The Hero with the WhatsApp Integration */}
      <HeroSection />

      {/* 2. The Step-by-Step Guide */}
      <HowItWorks />

      {/* 3. The Live Fleet Grid (Cached via ISR) */}
      <FleetServices />
    </div>
  );
}