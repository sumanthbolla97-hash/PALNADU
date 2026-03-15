import { motion } from "motion/react";

export function BrandStory() {
  return (
    <section id="story" className="py-16 lg:py-32 bg-brand-gray relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center mix-blend-luminosity pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-brand-black/50"
          >
            <img 
              src="/traditional-spices.png" 
              alt="Traditional Spices" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-brand-red"></span>
              <span className="text-brand-red uppercase tracking-[0.2em] text-sm font-medium">Our Heritage</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-serif text-brand-cream leading-[1.1] mb-6">
              Crafted from <br />
              <span className="italic text-brand-cream/80">Tradition</span>
            </h2>
            
            <p className="text-brand-cream/70 text-lg leading-relaxed mb-6 font-light">
              Inspired by the culinary legacy of Palnadu, our karam podis are made using recipes passed through generations. Each batch is slow-roasted and stone-ground to preserve aroma, texture, and authenticity.
            </p>
            
            <p className="text-brand-cream/70 text-lg leading-relaxed mb-8 font-light">
              We believe that true flavor cannot be rushed. It requires patience, the finest handpicked ingredients, and a deep respect for the methods of our ancestors.
            </p>
            
            <div className="w-24 h-px bg-brand-cream/20"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
