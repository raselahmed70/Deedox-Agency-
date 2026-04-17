import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { bgOpacity4, bgImage4, contact } = useSettings();

  return (
    <footer className="relative py-16 border-t border-white/5 overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage4} 
          alt="Footer Background" 
          className="w-full h-full object-cover grayscale transition-opacity duration-700"
          style={{ opacity: bgOpacity4 / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 mb-16 relative z-10 px-8">
        <div className="space-y-6 md:w-1/4 flex flex-col items-center md:items-start text-center md:text-left" id="footer-branding">
          <h3 className="font-serif text-2xl text-white">Deedox Agency</h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs font-sans">
            Building Premium Digital Experiences. We create powerful online experiences that help you grow your business.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 md:gap-8 md:w-3/4">
          <div className="space-y-4 md:space-y-6 overflow-hidden flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/30 truncate">Quick Links</h4>
            <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start">
               <a href="/#" className="text-white/60 hover:text-white transition-colors text-[10px] md:text-sm">Home</a>
               <a href="/#services" className="text-white/60 hover:text-white transition-colors text-[10px] md:text-sm">Services</a>
               <a href="/#portfolio" className="text-white/60 hover:text-white transition-colors text-[10px] md:text-sm">Portfolio</a>
               <a href="/#pricing" className="text-white/60 hover:text-white transition-colors text-[10px] md:text-sm">Pricing</a>
               <a href="/#contact" className="text-white/60 hover:text-white transition-colors text-[10px] md:text-sm">Contact</a>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6 overflow-hidden flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/30 truncate">Contact Us</h4>
            <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start text-[10px] md:text-sm text-white/60">
               <p className="truncate" title={(!contact?.email || contact?.email === 'hello@deedox.com') ? "deedoxteam@gmail.com" : contact.email}>
                  {(!contact?.email || contact?.email === 'hello@deedox.com') ? "deedoxteam@gmail.com" : contact.email}
               </p>
               <p className="truncate">{contact?.whatsapp_number || "+880 1817296013"}</p>
               <p className="truncate line-clamp-1">{contact?.address || "Bangladesh"}</p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6 overflow-hidden flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/30 truncate">Legal</h4>
            <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start text-[10px] md:text-sm text-white/60">
               <Link to="/privacy-policy" className="truncate hover:text-white transition-colors">Privacy Policy</Link>
               <Link to="/terms-of-service" className="truncate hover:text-white transition-colors">Terms of Service</Link>
               <Link to="/support" className="truncate hover:text-white transition-colors">Help & Support</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-white/20 text-xs tracking-wider uppercase font-bold relative z-10">
        <p>© 2026 Deedox Agency. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
