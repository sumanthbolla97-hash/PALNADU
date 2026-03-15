import { useEffect } from "react";
import { motion } from "motion/react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { SignatureCollection } from "../components/SignatureCollection";
import { BrandStory } from "../components/BrandStory";
import { Process } from "../components/Process";
import { Experience } from "../components/Experience";
import { Testimonials } from "../components/Testimonials";
import { FinalCTA } from "../components/FinalCTA";

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-brand-black min-h-screen"
    >
      <Hero />
      <TrustBar />
      <SignatureCollection />
      <BrandStory />
      <Process />
      <Experience />
      <Testimonials />
      <FinalCTA />
    </motion.main>
  );
}
