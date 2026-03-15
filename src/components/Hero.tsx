import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-end pb-12 overflow-hidden bg-brand-black">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-black/50 z-10" />
        <img 
          src="/traditional-spices.png"
          alt="Palnadu Karam Podi" 
          className="w-full h-full object-cover opacity-90 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
      </motion.div>
      
      <div className="max-w-[100rem] mx-auto px-6 w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 lg:mb-8"
        >
          <div className="max-w-md">
            <p className="text-brand-cream/90 text-lg md:text-xl font-light leading-relaxed">
              Rooted in Andhra's culinary heritage, crafting authentic karam podis through time-honored slow roasting.
            </p>
          </div>
          <a 
            href="#shop" 
            className="group flex items-center gap-4 text-brand-cream hover:text-brand-red transition-colors"
          >
            <span className="text-sm tracking-[0.2em] uppercase font-medium">Explore Collection</span>
            <div className="w-12 h-12 rounded-full border border-brand-cream/30 flex items-center justify-center group-hover:border-brand-red transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[18vw] 2xl:text-[280px] leading-[0.85] font-serif text-brand-cream tracking-tighter uppercase drop-shadow-2xl"
        >
          Palnadu
        </motion.h1>
      </div>
    </section>
  );
}
