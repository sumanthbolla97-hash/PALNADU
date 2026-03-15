import { motion } from "motion/react";

export function Experience() {
  return (
    <section className="py-16 lg:py-32 bg-brand-gray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start order-2 lg:order-1"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-px bg-brand-red"></span>
            <span className="text-brand-red uppercase tracking-[0.2em] text-sm font-medium">The Ritual</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-serif text-brand-cream leading-[1.1] mb-6">
            More Than Spice — <br />
            <span className="italic text-brand-cream/80">It’s Experience</span>
          </h2>
          
          <p className="text-brand-cream/70 text-lg leading-relaxed mb-6 font-light">
            From hot rice with ghee to morning idlis, Palnadu karam podis bring warmth, nostalgia, and bold Andhra flavor to every meal.
          </p>
          
          <p className="text-brand-cream/70 text-lg leading-relaxed mb-8 font-light">
            It is the aroma that fills the kitchen, the comforting heat that lingers, and the memories of home that make every bite special.
          </p>
          
          <div className="w-24 h-px bg-brand-cream/20"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-brand-black/50 order-1 lg:order-2"
        >
          <img 
            src="/Theritual.png" 
            alt="The Ritual" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
