import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { WhyBytecode } from "@/components/home/WhyBytecode";
import { ThePath } from "@/components/home/ThePath";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pricing } from "@/components/home/Pricing";
import { ForumPreview } from "@/components/home/ForumPreview";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyBytecode />
        <ThePath />
        <HowItWorks />
        <Pricing />
        <ForumPreview />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
