import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";

export function FloatingCart() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-16 h-16 bg-brand-red text-brand-bg shadow-2xl shadow-brand-red/40 flex items-center justify-center group border border-brand-red-light"
    >
      <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-text text-brand-bg text-[10px] font-bold flex items-center justify-center border border-brand-bg">
        0
      </span>
    </motion.button>
  );
}
