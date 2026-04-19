import React, { useEffect } from 'react';
import Footer from '../components/layout/Footer';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto z-10 flex flex-col justify-center">
        <div className="liquid-glass p-8 md:p-16 rounded-[40px] border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          {/* Close Button */}
          <Link 
            to="/" 
            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all z-50 group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </Link>

          {/* Background element for aesthetic */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 relative z-10">Privacy Policy</h1>
          <div className="space-y-6 text-white/60 font-sans leading-relaxed text-sm md:text-base relative z-10">
            <p>
              At Deedox Agency, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Deedox Agency and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>
            
            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Information We Collect</h2>
            <p>
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <p>
              If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>
            
            <h2 className="text-2xl font-serif text-white mt-10 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/50">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Log Files</h2>
            <p>
              Deedox Agency follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
            
            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
