import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Check, Flame, Leaf, Package, Heart } from "lucide-react";
import { products } from "../data/products";
import { useEffect } from "react";
import { useCart } from "../components/CartContext";
import { CollapsibleSection } from "../components/CollapsibleSection";

export function Product() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-text">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Product Not Found</h2>
          <Link to="/" className="text-brand-red hover:text-brand-text transition-colors uppercase tracking-widest text-sm">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-brand-bg pt-24 pb-32"
    >
      <div className="max-w-[100rem] mx-auto px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-text transition-colors uppercase tracking-widest text-xs mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative">
          {/* Left: Sticky Image Gallery */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] overflow-hidden bg-brand-surface shadow-2xl shadow-brand-red/5 group border border-brand-text/10 rounded-[2rem]"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Spice Level Indicator */}
              <div className="absolute bottom-8 left-8 flex items-center gap-2 bg-brand-bg/90 backdrop-blur-md px-4 py-2 border border-brand-text/10 rounded-full">
                <span className="text-xs tracking-widest uppercase text-brand-text/80 font-medium mr-2">Heat</span>
                {[1, 2, 3, 4, 5].map((level) => (
                  <Flame 
                    key={level} 
                    className={`w-4 h-4 ${level <= 4 ? 'text-brand-red fill-brand-red' : 'text-brand-text/20'}`} 
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Scrolling Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start pt-8 lg:pb-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-brand-gold"></span>
                <span className="text-brand-gold uppercase tracking-[0.2em] text-xs font-medium">Authentic Recipe</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-brand-text leading-[1.1] mb-8">
                {product.name}
              </h1>
              
              <div className="text-3xl font-serif text-brand-text/90 mb-10 flex items-baseline gap-3">
                ₹{product.price} <span className="text-sm font-sans text-brand-text/50 tracking-widest uppercase">/ {product.weight}</span>
              </div>
              
              <p className="text-brand-text/70 text-xl leading-relaxed mb-16 font-light">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full mb-20">
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(product, 1)}
                  className="group relative px-10 py-5 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm overflow-hidden w-full sm:flex-1 text-center shadow-lg shadow-brand-red/20 hover:-translate-y-0.5 transition-transform"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Add to Cart
                  </span>
                  <div className="absolute inset-0 bg-brand-red-light scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                </motion.button>
                
                <button className="px-10 py-5 text-brand-text border border-brand-text/20 hover:border-brand-gold hover:text-brand-gold transition-colors tracking-widest uppercase text-sm w-full sm:flex-1 text-center font-medium">
                  Buy Now
                </button>
              </div>

              {/* Accordion / Details Section */}
              <div className="w-full flex flex-col gap-4">
                <CollapsibleSection title="Ingredients" icon={<Leaf className="w-5 h-5" />} defaultOpen={true}>
                  <p className="text-brand-text/60 text-base font-light leading-relaxed">
                    {product.ingredients}
                  </p>
                </CollapsibleSection>
                <CollapsibleSection title="Health Benefits" icon={<Heart className="w-5 h-5" />} defaultOpen={true}>
                  <p className="text-brand-text/60 text-base font-light leading-relaxed">
                    {product.healthBenefits}
                  </p>
                </CollapsibleSection>
                <CollapsibleSection title="Shelf Life & Storage" icon={<Package className="w-5 h-5" />}>
                  <div className="flex flex-col gap-4">
                    <p className="text-brand-text/60 text-base font-light">
                      <strong className="text-brand-text/80 font-medium">Shelf Life:</strong> {product.shelfLife}
                    </p>
                    <p className="text-brand-text/60 text-base font-light">
                      <strong className="text-brand-text/80 font-medium">Storage:</strong> {product.storage}
                    </p>
                  </div>
                </CollapsibleSection>
              </div>
              
              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 w-full text-brand-gold/60 text-xs tracking-[0.2em] uppercase font-medium">
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Secure Checkout</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Fast Delivery</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Authentic Taste</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
