import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
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

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" }
      }}
      animate={hidden && !mobileMenuOpen ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 pt-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
    >
      <motion.div 
        animate={{ height: hidden ? "4rem" : (scrollY.get() > 50 ? "3.5rem" : "4rem") }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-brand-bg/90 backdrop-blur-xl border border-brand-text/10 px-6 lg:px-10 flex items-center justify-between gap-16 pointer-events-auto shadow-xl shadow-brand-text/5 w-full max-w-[100rem] rounded-full overflow-visible"
      >
        <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.2em] uppercase text-brand-text/80 font-medium">
          <Link to="/#shop" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Shop</Link>
          <Link to="/#story" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Story</Link>
        </div>

        <Link to="/" className="text-2xl font-serif tracking-wide text-brand-text hover:scale-105 transition-transform duration-500">
          Palnadu
        </Link>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-10 text-xs tracking-[0.2em] uppercase text-brand-text/80 font-medium">
            <Link to="/#process" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Process</Link>
            <Link to="/#contact" className="inline-block hover:text-brand-text hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 origin-center">Contact</Link>
            {user ? (
              <div className="relative group py-4 -my-4">
                <Link to="/profile" className="inline-flex items-center gap-1.5 hover:text-brand-text transition-colors uppercase">
                  Profile <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute right-0 top-full pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-[0.16,1,0.3,1]">
                  <div className="bg-brand-bg/95 backdrop-blur-xl border border-brand-text/10 rounded-2xl p-2 flex flex-col min-w-[200px] shadow-2xl">
                    <div className="px-4 py-3 mb-1 border-b border-gray-100">
                      <p className="text-brand-text font-medium tracking-wider text-xs capitalize truncate">{user.name}</p>
                      <p className="text-brand-text/50 text-[9px] tracking-widest truncate mt-0.5">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium text-brand-red hover:bg-brand-surface rounded-xl transition-colors">Admin Dashboard</Link>
                    )}
                    <Link to="/profile" className="px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium text-brand-text/60 hover:text-brand-text hover:bg-brand-surface rounded-xl transition-colors">My Account</Link>
                    <button onClick={logout} className="text-left px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium text-brand-text/50 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-colors mt-1">Sign Out</button>
                  </div>
                </div>
              </div>
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
              initial={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 mt-4 bg-brand-bg/95 backdrop-blur-2xl border border-brand-text/10 p-6 flex flex-col gap-6 pointer-events-auto shadow-2xl lg:hidden rounded-2xl mx-auto max-h-[calc(100dvh-6rem)] overflow-y-auto hide-scrollbar"
            >
              <Link to="/#shop" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">Shop</Link>
              <Link to="/#story" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">Story</Link>
              <Link to="/#process" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">Process</Link>
              <Link to="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">Contact</Link>
              {user ? (
                <>
                  <div className="h-px bg-brand-text/10 my-2"></div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <span className="text-brand-text font-serif text-lg mb-1">{user.name}</span>
                      <span className="text-brand-text/40 text-xs tracking-widest uppercase truncate">{user.email}</span>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-red font-medium py-1">Admin Dashboard</Link>
                    )}
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">My Account</Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-base tracking-[0.2em] uppercase text-brand-text/50 font-medium hover:text-brand-red transition-colors py-1">Sign Out</button>
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-brand-text/80 font-medium py-1">Login</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}
