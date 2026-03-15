import { motion } from "motion/react";
import { Leaf, Flame, ShieldCheck, Heart } from "lucide-react";

export function TrustBar() {
  const items = [
    { icon: <Heart className="w-5 h-5" />, text: "Traditional Recipes" },
    { icon: <Flame className="w-5 h-5" />, text: "Small Batch Crafted" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "No Preservatives" },
    { icon: <Leaf className="w-5 h-5" />, text: "Authentic Andhra Taste" },
  ];

  return (
    <section className="bg-brand-gray border-y border-white/5 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-brand-cream transition-colors duration-300">
                {item.icon}
              </div>
              <span className="text-sm tracking-widest uppercase text-brand-cream/80 font-medium">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
