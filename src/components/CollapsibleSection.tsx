import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-brand-surface/30 rounded-[2rem] border border-brand-text/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left hover:bg-brand-surface/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-brand-red">{icon}</div>}
          <h3 className="text-xl font-serif text-brand-text uppercase">{title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-brand-text/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-6 border-t border-brand-text/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
