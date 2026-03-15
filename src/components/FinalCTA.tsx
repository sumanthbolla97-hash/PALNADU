import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 bg-brand-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-px bg-brand-red"></span>
            <span className="text-brand-red uppercase tracking-[0.2em] text-sm font-medium">Taste the Tradition</span>
            <span className="w-12 h-px bg-brand-red"></span>
          </div>
          
          <h2 className="text-4xl lg:text-7xl font-serif text-brand-cream leading-[1.1] mb-8 lg:mb-12">
            Experience Authentic <br />
            <span className="italic text-brand-cream/80">Andhra Flavor</span>
          </h2>
          
          <a 
            href="#shop" 
            className="group relative px-10 py-5 bg-brand-cream text-brand-black font-medium tracking-wider uppercase text-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
