import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-text">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <AlertTriangle className="w-16 h-16 text-brand-red mx-auto mb-4" />
        <h1 className="text-6xl font-serif mb-2">404</h1>
        <p className="text-xl text-brand-text/80 mb-8">Page Not Found</p>
        <Link
          to="/"
          className="px-6 py-3 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-red-light transition-colors"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
