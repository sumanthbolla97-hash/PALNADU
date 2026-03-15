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
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
