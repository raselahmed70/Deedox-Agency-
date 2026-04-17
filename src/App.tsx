import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import VelorahHero from './components/velorah-hero';
import Header from './components/layout/Header';
import AboutUs from './components/sections/about-us';
import WhyChooseUs from './components/sections/why-choose-us';
import OurServices from './components/sections/our-services';
import PortfolioGallery from './components/portfolio-gallery';
import AuroraPricing from './components/ui/aurora-pricing';
import Testimonials from './components/sections/testimonials';
import StatsSection from './components/sections/stats-section';
import ContactSection from './components/sections/contact-section';
import { FloatingChatWidget } from './components/ui/floating-chat-widget';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import HeroEditor from './pages/admin/HeroEditor';
import ServicesEditor from './pages/admin/ServicesEditor';
import PortfolioEditor from './pages/admin/PortfolioEditor';
import PricingEditor from './pages/admin/PricingEditor';
import TestimonialsEditor from './pages/admin/TestimonialsEditor';
import ProcessEditor from './pages/admin/ProcessEditor';
import ContactInfoEditor from './pages/admin/ContactInfoEditor';
import SiteSettings from './pages/admin/SiteSettings';
import AiSettings from './pages/admin/AiSettings';
import Inbox from './pages/admin/Inbox';
import { useSettings } from './context/SettingsContext';

const HomePage = ({ onAboutClick }: { onAboutClick: () => void }) => {
  const { bgOpacity4, bgImage4 } = useSettings();
  
  return (
    <>
      {/* 🏠 Hero Section */}
      <VelorahHero onAboutClick={onAboutClick} />
      
      {/* 🔥 Why Choose Us Section */}
      <WhyChooseUs />

      {/* 🛠 Our Services Section */}
      <OurServices />

      {/* 🖼 Our Demo Websites (Portfolio) */}
      <PortfolioGallery />
      
      {/* 💰 Pricing Section */}
      <AuroraPricing />

      {/* ⭐ Testimonials Section */}
      <Testimonials />

      {/* 📊 Stats Section */}
      <StatsSection />

      {/* 📩 Contact Section */}
      <ContactSection />

      {/* 🎯 Footer */}
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10 px-8">
          <div className="space-y-6" id="footer-branding">
            <h3 className="font-serif text-2xl text-white">Deedox Agency</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-sans">
              Building Premium Digital Experiences. We create powerful online experiences that help you grow your business.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Quick Links</h4>
            <div className="flex flex-col gap-4">
               <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Home</a>
               <a href="#services" className="text-white/60 hover:text-white transition-colors text-sm">Services</a>
               <a href="#portfolio" className="text-white/60 hover:text-white transition-colors text-sm">Portfolio</a>
               <a href="#pricing" className="text-white/60 hover:text-white transition-colors text-sm">Pricing</a>
               <a href="#contact" className="text-white/60 hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Contact Us</h4>
            <div className="flex flex-col gap-4 text-sm text-white/60">
               <p>your@email.com</p>
               <p>+880XXXXXXXXX</p>
               <p>Bangladesh</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Legal</h4>
            <div className="flex flex-col gap-4 text-sm text-white/60">
               <p>Privacy Policy</p>
               <p>Terms of Service</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-white/20 text-xs tracking-wider uppercase font-bold">
          <p>© 2026 Deedox Agency. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();
  const { seoSettings } = useSettings();

  useEffect(() => {
    if (seoSettings) {
      document.title = seoSettings.meta_title || 'Deedox Agency | Cinematic Digital Experiences';
      
      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seoSettings.meta_description || '');

      // Update Keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', Array.isArray(seoSettings.keywords) ? seoSettings.keywords.join(', ') : (seoSettings.keywords || ''));
    }
  }, [seoSettings]);

  return (
    <main className="relative min-h-screen bg-[#050505] text-foreground selection:bg-white/20 overflow-x-hidden">
      {!location.pathname.startsWith('/deedoxadmin') && (
        <Header onAboutClick={() => setIsAboutOpen(true)} />
      )}
      {/* Global Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-purple-600/5 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[15%] w-[20%] h-[20%] bg-blue-400/5 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <Routes>
        <Route path="/" element={<HomePage onAboutClick={() => setIsAboutOpen(true)} />} />
        
        {/* 🏢 Professional Admin Routes */}
        <Route path="/deedoxadmin/login" element={<Login />} />
        <Route path="/deedoxadmin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="services" element={<ServicesEditor />} />
          <Route path="portfolio" element={<PortfolioEditor />} />
          <Route path="pricing" element={<PricingEditor />} />
          <Route path="testimonials" element={<TestimonialsEditor />} />
          <Route path="process" element={<ProcessEditor />} />
          <Route path="contact" element={<ContactInfoEditor />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="ai" element={<AiSettings />} />
          <Route path="inbox" element={<Inbox />} />
        </Route>
      </Routes>

      {/* 🤖 AI Support Chat */}
      <FloatingChatWidget />

      {/* 💼 Cinematic About Overlay */}
      <AboutUs isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
}

export default App;
