import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-bg pt-20 lg:pt-32 pb-8 lg:pb-12 overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 lg:mb-32">
          <div className="flex flex-col items-start lg:col-span-2">
            <p className="text-brand-text/80 text-lg lg:text-xl leading-relaxed font-light max-w-md mb-6 lg:mb-8">
              Ancient Spice Traditions. Crafted in Andhra, enjoyed everywhere.
            </p>
            <a href="mailto:hello@palnadu.com" className="text-3xl font-serif text-brand-text hover:text-brand-red transition-colors">
              hello@palnadu.com
            </a>
          </div>
          
          <div className="flex flex-col items-start">
            <h4 className="text-brand-text font-medium tracking-[0.2em] uppercase text-xs mb-6 lg:mb-8">Navigation</h4>
            <div className="flex flex-col gap-4 text-brand-text/60 text-lg font-light">
              <Link to="/#shop" className="hover:text-brand-text transition-colors">Shop</Link>
              <Link to="/#story" className="hover:text-brand-text transition-colors">Our Story</Link>
              <Link to="/#process" className="hover:text-brand-text transition-colors">Process</Link>
            </div>
          </div>
          
          <div className="flex flex-col items-start">
            <h4 className="text-brand-text font-medium tracking-[0.2em] uppercase text-xs mb-6 lg:mb-8">Socials</h4>
            <div className="flex flex-col gap-4 text-brand-text/60 text-lg font-light">
              <a href="#" className="hover:text-brand-text transition-colors">Instagram</a>
              <a href="#" className="hover:text-brand-text transition-colors">WhatsApp</a>
              <a href="#" className="hover:text-brand-text transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        
        {/* Massive Footer Text */}
        <div className="w-full flex justify-center items-center border-t border-brand-text/10 pt-8 lg:pt-12 mb-8 lg:mb-12">
          <h2 className="text-[18vw] 2xl:text-[280px] leading-none font-serif text-brand-text/5 tracking-tighter uppercase select-none">
            PALNADU
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-brand-text/40 text-xs tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Palnadu Spices. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link to="/" className="hover:text-brand-text transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-brand-text transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
