import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { products, Product } from "../data/products";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export function SignatureCollection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section id="shop" className="py-20 lg:py-32 bg-brand-bg relative">
      <div className="max-w-[100rem] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-20"
        >
          <h2 className="text-5xl lg:text-7xl font-serif text-brand-text leading-[1.1]">
            Signature <br />
            <span className="italic text-brand-text/60">Collection</span>
          </h2>
          <p className="text-brand-text/60 text-lg font-light max-w-sm">
            Discover our range of authentic, small-batch karam podis crafted for the modern palate.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product, index) => {
            const cartItem = items.find(item => item.product.id === product.id);
            
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-brand-surface/30 p-3 md:p-6 rounded-[2rem] hover:bg-brand-surface transition-colors duration-500 border border-brand-text/5"
              >
                <div 
                  onClick={() => openQuickView(product)}
                  className="relative aspect-square overflow-hidden mb-4 md:mb-6 bg-brand-surface rounded-3xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-brand-bg/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover Reveal Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <div className="px-4 py-2 md:px-6 md:py-3 bg-brand-text/80 md:bg-brand-text text-brand-bg text-[10px] md:text-xs font-medium tracking-widest uppercase rounded-full transform md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-lg">
                      View Details
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                    <h3 className="text-base md:text-xl lg:text-2xl font-serif text-brand-text leading-tight">
                      {product.name}
                    </h3>
                    <span className="text-sm md:text-lg font-serif text-brand-text/80 whitespace-nowrap">
                      ₹{product.price}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-brand-text/10 flex justify-between items-center h-12">
                    <p className="text-brand-text/50 text-[10px] md:text-xs font-light tracking-widest uppercase">
                      {product.weight}
                    </p>
                    {cartItem ? (
                      <div className="flex items-center border border-brand-text/20 rounded-full p-1 bg-brand-bg shadow-sm">
                        <button onClick={(e) => { e.stopPropagation(); if (cartItem.quantity === 1) removeFromCart(product.id); else updateQuantity(product.id, cartItem.quantity - 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors text-brand-text"><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                        <span className="w-6 md:w-8 text-center text-xs font-medium text-brand-text">{cartItem.quantity}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors text-brand-text"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-brand-red font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1"
                      >
                        Add to Cart <ShoppingBag className="w-3 h-3 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Premium Quick View Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={closeQuickView}
              className="fixed inset-0 bg-brand-text/20 z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 h-full w-full md:w-[30rem] bg-brand-bg shadow-2xl z-50 overflow-y-auto border-l border-brand-text/10"
            >
              <div className="p-6 md:p-10 flex flex-col min-h-full">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-brand-text/60">Quick View</h3>
                  <button onClick={closeQuickView} className="p-2 hover:bg-brand-surface rounded-full transition-colors">
                    <X className="w-5 h-5 text-brand-text" />
                  </button>
                </div>
                
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-brand-surface mb-8">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif text-brand-text mb-2">{selectedProduct.name}</h2>
                <p className="text-brand-text/60 text-sm tracking-widest uppercase mb-6">{selectedProduct.weight}</p>
                
                <div className="text-2xl font-serif text-brand-text mb-8">₹{selectedProduct.price}</div>
                
                <p className="text-brand-text/70 font-light leading-relaxed mb-10">
                  {selectedProduct.shortDescription}
                </p>
                
                <div className="mt-auto pt-8 border-t border-brand-text/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border border-brand-text/20 rounded-full p-1">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors text-brand-text"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-brand-text">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors text-brand-text"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-brand-text/50 text-sm font-light">
                      Total: <span className="text-brand-text font-medium">₹{selectedProduct.price * quantity}</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      addToCart(selectedProduct, quantity);
                      closeQuickView();
                    }}
                    className="w-full py-5 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3 hover:-translate-y-0.5 shadow-lg shadow-brand-red/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                  
                  <Link 
                    to={`/product/${selectedProduct.id}`}
                    onClick={closeQuickView}
                    className="w-full py-5 mt-4 border border-brand-text/20 text-brand-text font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-surface transition-colors flex items-center justify-center"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
