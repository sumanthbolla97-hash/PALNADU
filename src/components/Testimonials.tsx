import { motion } from "motion/react";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      text: "Authentic taste after years. Reminds me of my grandmother's kitchen.",
      author: "Priya R.",
      location: "Hyderabad"
    },
    {
      text: "Exactly like homemade. The aroma of the roasted lentils is incredible.",
      author: "Karthik V.",
      location: "Bangalore"
    },
    {
      text: "Best karam podi brand I've tried. The perfect balance of spice and flavor.",
      author: "Ananya S.",
      location: "Chennai"
    }
  ];

  return (
    <section className="py-16 lg:py-32 bg-brand-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-px bg-brand-red"></span>
            <span className="text-brand-red uppercase tracking-[0.2em] text-sm font-medium">Voices</span>
            <span className="w-12 h-px bg-brand-red"></span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif text-brand-cream mb-6">Words from Home</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <Quote className="w-10 h-10 text-brand-red/20 mb-8 group-hover:text-brand-red transition-colors duration-500" />
              <p className="text-xl lg:text-2xl font-serif text-brand-cream/90 italic mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="mt-auto">
                <p className="text-brand-cream font-medium tracking-wider uppercase text-sm mb-1">{testimonial.author}</p>
                <p className="text-brand-cream/50 text-xs tracking-widest uppercase">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
