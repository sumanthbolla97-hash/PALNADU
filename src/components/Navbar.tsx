import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
    >
      <div className="relative bg-brand-bg/90 backdrop-blur-xl border border-brand-text/10 px-6 lg:px-10 h-16 flex items-center justify-between gap-16 pointer-events-auto shadow-xl shadow-brand-text/5 w-full max-w-[100rem]">
        <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.2em] uppercase text-brand-text/80 font-medium">
          <a href="/#shop" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Shop</a>
          <a href="/#story" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Story</a>
        </div>

        <Link to="/" className="text-2xl font-serif tracking-wide text-brand-text hover:scale-105 transition-transform duration-500">
          Palnadu
        </Link>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.2em] uppercase text-brand-text/80 font-medium">
            <a href="/#process" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Process</a>
            <a href="#contact" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Contact</a>
            {isAdmin && (
              <Link to="/admin" className="inline-block text-brand-red hover:text-brand-red-light hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Admin</Link>
            )}
            {user ? (
              <button onClick={logout} className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center uppercase">Logout</button>
            ) : (
              <Link to="/login" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Login</Link>
            )}
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-brand-text hover:scale-110 transition-transform duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-4 bg-brand-bg/95 backdrop-blur-2xl border border-brand-text/10 p-6 flex flex-col gap-6 pointer-events-auto shadow-2xl lg:hidden rounded-2xl mx-auto"
            >
              <a href="/#shop" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium">Shop</a>
              <a href="/#story" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium">Story</a>
              <a href="/#process" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium">Process</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium">Contact</a>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-red font-medium">Admin</Link>
              )}
              {user ? (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium text-left">Logout</button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm tracking-[0.2em] uppercase text-brand-text/80 font-medium">Login</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
