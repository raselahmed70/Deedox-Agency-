import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Zap, Target } from "lucide-react";

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-center overflow-y-auto py-10 md:py-20 px-4 scrollbar-hide"
        >
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(40px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 cursor-pointer pointer-events-auto"
          />

          {/* Liquid Background Blobs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                x: [0, 80, -40, 0],
                y: [0, -40, 80, 0],
                rotate: [0, 90, 180, 360]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                x: [0, -80, 40, 0],
                y: [0, 60, -40, 0],
                rotate: [360, 180, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-600/10 blur-[100px] rounded-full" 
            />
          </div>

          {/* Content Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl p-8 md:p-16 rounded-[40px] liquid-glass border border-white/10 bg-white/[0.02] shadow-2xl z-20 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white/50 hover:text-white z-[30]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col gap-12">
              <div className="max-w-2xl">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-sm font-bold uppercase tracking-[4px] mb-4 block"
                >
                  Our Identity
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-serif text-white leading-tight"
                >
                  About <em className="not-italic text-white/40">Deedox Agency</em>
                </motion.h2>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <AboutCard 
                  delay={0.4}
                  icon={<Globe className="w-6 h-6" />}
                  title="Premium Quality"
                  description="We are a professional digital agency focused on creating premium-quality websites for businesses, startups, and personal brands."
                />
                <AboutCard 
                  delay={0.5}
                  icon={<Zap className="w-6 h-6" />}
                  title="Powerful Impact"
                  description="We don’t just build websites — we create powerful online experiences that help you grow your business and increase revenue."
                />
                <AboutCard 
                  delay={0.6}
                  icon={<Target className="w-6 h-6" />}
                  title="Custom Solutions"
                  description="Whether you need an eCommerce store, business website, or custom web solution — we’ve got you covered with precision."
                />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-12 border-t border-white/5 flex flex-wrap gap-8 md:gap-12"
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-white">2026</span>
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Founded</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-white">Global</span>
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Reach</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif text-white">Cinema</span>
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Style</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AboutCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex flex-col gap-4 group"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-white mt-2">{title}</h3>
    <p className="text-white/40 text-sm leading-relaxed font-sans">
      {description}
    </p>
  </motion.div>
);

export default AboutUs;
