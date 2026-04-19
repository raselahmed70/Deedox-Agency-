import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick }) => {
  const { seoSettings, hero } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const brandName = seoSettings?.site_name || "Deedox Agency";
  const heroData = hero || {
    cta1_text: "Get Started",
    cta1_url: "#contact"
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 pointer-events-auto ${
        isScrolled ? 'py-4 bg-black/40 backdrop-blur-xl' : 'py-6 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl flex-row items-center justify-between px-6 md:px-8">
        {/* Brand */}
        <Link to="/" className="font-serif text-2xl md:text-3xl tracking-tight text-foreground transition-all duration-300 hover:opacity-80">
          {brandName}<sup className="text-xs">®</sup>
        </Link>
        
        {/* Desktop Links (Hardcoded for 100% Fidelity) */}
        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          <a href="/" className="text-sm transition-colors text-foreground">Home</a>
          <button 
            onClick={onAboutClick}
            className="text-sm transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            About
          </button>
          <a href="/#services" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Services</a>
          <a href="/#portfolio" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Portfolio</a>
          <a href="/#pricing" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="/#contact" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Contact</a>
        </div>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3 md:gap-4">
            <a 
              href={heroData.cta1_url}
              className="liquid-glass rounded-full px-5 py-2 md:px-6 md:py-2.5 text-xs md:text-sm text-foreground transition-transform hover:scale-[1.03] inline-block border border-white/10"
            >
              {heroData.cta1_text}
            </a>

            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl liquid-glass border border-white/10 text-foreground z-[70] transition-transform active:scale-95"
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:hidden"
                style={{ height: '100vh', width: '100vw' }}
            >
                {/* Immersive Backdrop Blur */}
                <motion.div
                    initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                    animate={{ backdropFilter: "blur(40px)", backgroundColor: "rgba(0,0,0,0.6)" }}
                    exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute inset-0 cursor-pointer"
                />
                
                {/* Liquid Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <motion.div 
                        animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0], rotate: [0, 90, 180, 270] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full" 
                    />
                    <motion.div 
                        animate={{ x: [0, -50, 40, 0], y: [0, 30, -50, 0], rotate: [270, 180, 90, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-zinc-600/10 blur-[60px] rounded-full" 
                    />
                </div>

                {/* Professional Navigation Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-sm rounded-[40px] liquid-glass border border-white/10 bg-white/[0.02] p-10 py-16 shadow-2xl z-20 flex flex-col items-center gap-10"
                >
                    <Link to="/" className="font-serif text-3xl tracking-tight text-white mb-4 hover:opacity-80" onClick={() => setIsMenuOpen(false)}>
                        {brandName}<sup className="text-xs">®</sup>
                    </Link>

                    <div className="flex flex-col items-center gap-6 w-full text-center">
                        <MobileNavLink name="Home" href="/" active onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink name="About" onClick={() => { onAboutClick(); setIsMenuOpen(false); }} />
                        <MobileNavLink name="Services" href="/#services" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink name="Portfolio" href="/#portfolio" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink name="Pricing" href="/#pricing" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink name="Contact" href="/#contact" onClick={() => setIsMenuOpen(false)} />
                    </div>

                    <a 
                        href={heroData.cta1_url}
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-6 w-full h-16 rounded-2xl liquid-glass border border-white/10 text-white font-bold uppercase tracking-[4px] text-xs flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                        {heroData.cta1_text}
                    </a>

                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

const MobileNavLink = ({ name, href, onClick, active }: { name: string, href?: string, onClick?: () => void, active?: boolean }) => {
    const content = (
        <span className={`text-2xl font-serif transition-all ${active ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            {name}
        </span>
    );

    if (href) {
        return (
            <a href={href} onClick={onClick} className="py-2 block">
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className="py-2 block">
            {content}
        </button>
    );
};
