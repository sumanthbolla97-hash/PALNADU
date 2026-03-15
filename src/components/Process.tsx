import { motion } from "motion/react";

export function Process() {
  const steps = [
    {
      number: "01",
      title: "Sourcing",
      desc: "We handpick premium ingredients directly from local Andhra farmers, ensuring only the highest quality spices make it to our kitchen."
    },
    {
      number: "02",
      title: "Sun Drying",
      desc: "Ingredients are naturally sun-dried to remove moisture while locking in their essential oils and vibrant natural colors."
    },
    {
      number: "03",
      title: "Slow Roasting",
      desc: "Each ingredient is individually slow-roasted over low heat in heavy-bottomed pans to develop deep, complex flavor profiles."
    },
    {
      number: "04",
      title: "Stone Grinding",
      desc: "We use traditional stone grinding methods to achieve the perfect coarse texture that machine grinding simply cannot replicate."
    }
  ];

  return (
    <section id="process" className="py-20 lg:py-32 bg-brand-bg relative">
      <div className="max-w-[100rem] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Sticky Left */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-5xl lg:text-7xl font-serif text-brand-text leading-[1.1] mb-6">
                The Art of <br />
                <span className="italic text-brand-text/60">Crafting</span>
              </h2>
              <p className="text-brand-text/60 text-lg font-light leading-relaxed max-w-sm">
                Our process is a labor of love, requiring patience, precision, and a deep respect for ancestral methods.
              </p>
            </div>
          </div>

          {/* Scrolling Right */}
          <div className="lg:w-2/3 flex flex-col gap-16 lg:gap-24">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-start"
              >
                <span className="text-4xl lg:text-6xl font-serif text-brand-red/50 italic">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-serif text-brand-text mb-6">{step.title}</h3>
                  <p className="text-brand-text/70 text-lg lg:text-xl font-light leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
