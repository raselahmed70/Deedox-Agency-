import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VelorahHeroProps {
  onAboutClick: () => void;
}

const VelorahHero: React.FC<VelorahHeroProps> = ({ onAboutClick }) => {
  const { hero, seoSettings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const brandName = seoSettings?.site_name || "Deedox Agency";
  
  // Default values if DB is empty
  const heroData = hero || {
    badge: "PREMIUM WEB SOLUTIONS",
    headline: "We Build Premium Websites That Grow Your Business",
    highlight_word: "Premium Websites",
    subheading: "Deedox Agency helps businesses of all sizes build powerful, modern, and high-converting websites that stand out in the digital world.",
    cta1_text: "Get Started",
    cta1_url: "#contact",
    cta2_text: "View Our Work",
    cta2_url: "#portfolio",
    video_url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
  };

  // Splitting headline to insert highlighted part
  const renderHeadline = () => {
    if (!heroData.highlight_word || !heroData.headline.includes(heroData.highlight_word)) {
      return heroData.headline;
    }
    const parts = heroData.headline.split(heroData.highlight_word);
    return (
      <>
        {parts[0]}
        <em className="not-italic text-white/30 italic">{heroData.highlight_word}</em>
        {parts[1]}
      </>
    );
  };

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', type: 'button', onClick: onAboutClick },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (link: any) => {
    if (link.type === 'button') {
        link.onClick();
    }
    setIsMenuOpen(false);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video Background */}
      <video
        key={heroData.video_url} // Force reload on change
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={heroData.video_url} type="video/mp4" />
      </video>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-40 text-center">
        {heroData.badge && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
          >
            {heroData.badge}
          </motion.div>
        )}
        
        <h1 className="animate-fade-rise max-w-5xl font-serif text-5xl leading-[1.1] tracking-[-2px] text-foreground sm:text-7xl md:text-8xl">
          {renderHeadline()}
        </h1>
        
        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {heroData.subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-rise-delay-2">
          <a 
            href={heroData.cta1_url}
            className="liquid-glass cursor-pointer rounded-full px-14 py-5 text-base text-foreground transition-transform hover:scale-[1.03] inline-block border border-white/10"
          >
            {heroData.cta1_text}
          </a>
          <a 
            href={heroData.cta2_url}
            className="rounded-full px-14 py-5 text-base text-foreground border border-white/10 backdrop-blur-sm transition-all hover:bg-white/5 inline-block"
          >
            {heroData.cta2_text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default VelorahHero;

const MobileNavLink = ({ name, href, onClick, active }: { name: string, href?: string, onClick?: () => void, active?: boolean }) => {
    const content = (
        <span className={`text-2xl font-serif transition-all ${active ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            {name}
        </span>
    );

    if (href) {
        return (
            <a href={href} onClick={onClick} className="py-2">
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className="py-2">
            {content}
        </button>
    );
};
