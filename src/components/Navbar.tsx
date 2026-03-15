import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
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
      <div className="bg-brand-bg/90 backdrop-blur-xl border border-brand-text/10 px-10 h-16 flex items-center justify-between gap-16 pointer-events-auto shadow-xl shadow-brand-text/5 w-full max-w-[100rem]">
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
          <Menu className="w-5 h-5 text-brand-text cursor-pointer lg:hidden hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
    </motion.nav>
  );
}
